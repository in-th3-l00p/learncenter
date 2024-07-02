import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import User from "@/models/User";
import stripe from "@/lib/stripe";
import { Button } from "@nextui-org/button";
import { Stripe } from "stripe";
import { Card, CardBody } from "@nextui-org/card";
import createBillingPortal from "@/lib/serverActions/createBillingPortal";

async function Product({ name, description, price, productId, currentSubscription }: {
  name: string;
  description: string;
  price: string;
  productId: string;
  currentSubscription: Stripe.Subscription | null;
}) {
  const product = await stripe.products.retrieve(productId);
  if (!product.default_price)
    return;
  const productPriceId =
    typeof product.default_price === "string" ?
      product.default_price :
      product.default_price.id;

  async function handleSubscribe() {
    "use server";

    const session = await getServerSession(authOptions);
    if (!session)
      return redirect("/api/auth/signin");

    const user = await User.findById(session.user.id);
    if (!user)
      return redirect("/api/auth/signin");

    let customer;
    if (!user.customerId) {
      customer = await stripe.customers.create({
        email: user.email,
      });

      user.customerId = customer.id;
      await user.save();
    } else
      customer = await stripe.customers.retrieve(user.customerId);

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: productPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/profile?subscription=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    });
    if (!checkoutSession)
      return;

    return redirect(checkoutSession.url || "/pricing");
  }

  return (
    <form action={handleSubscribe} className={"max-w-[200px]"}>
      <h2 className={"text-xl font-bold mb-2"}>{name}</h2>
      <p className={"text-small mb-16"}>{description}</p>

      <div className={"flex items-center gap-2 mb-2"}>
        <p className={"text-4xl font-bold"}>{price}</p>
        <p className={"text-small"}>per<br />month</p>
      </div>

      <input
        type={"text"}
        name={"productId"}
        value={productId}
        readOnly
        hidden
      />

      <Button
        type={"submit"}
        className={"w-full flex items-center"}
        disabled={!!currentSubscription}
      >
        Subscribe
        {currentSubscription?.items.data[0].price.id === productPriceId && (
          <span className={"text-xs font-light"}>(Current)</span>
        )}
      </Button>
    </form>
  );
}

export default async function PricingTable() {
  const PRODUCTS = {
    FREE: "prod_QJKQKUAJrhwcQA",
    BASIC: "prod_QJKQYunCqGX55f",
  }

  let subscription = null;
  const session = await getServerSession(authOptions);
  if (session) {
    const user = await User.findById(session.user.id);
    if (user)
      subscription = await stripe
        .subscriptions
        .retrieve(user.subscriptionId);
  }

  return (
    <div className="mt-16">
      {subscription && (
        <Card className={"mb-16 max-w-fit mx-auto"}>
          <CardBody className={"flex flex-wrap flex-row gap-16 justify-between"}>
            <p className={"max-w-[400px]"}>
              You are currently subscribed. Click on the {`"Manage"`} button to manage your subscription
            </p>

            <form action={createBillingPortal}>
              <Button type={"submit"}>
                Manage
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      <div className="flex flex-wrap gap-16 justify-center items-center mb-16">
        {/* @ts-ignore */}
        <Product
          name={"Free"}
          description={"Includes basic access to the application"}
          price={"RON 0"}
          productId={PRODUCTS.FREE}
          currentSubscription={subscription}
        />

        {/* @ts-ignore */}
        <Product
          name={"Basic"}
          description={"Includes access to the main application features"}
          price={"RON 25"}
          productId={PRODUCTS.BASIC}
          currentSubscription={subscription}
        />
      </div>
    </div>
  );
}