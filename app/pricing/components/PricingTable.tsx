import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import User from "@/models/User";
import stripe from "@/lib/stripe";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import createBillingPortal from "@/lib/serverActions/createBillingPortal";
import { Product } from "@/app/pricing/components/Product";

export default async function PricingTable() {
  const PRODUCTS = {
    FREE: "prod_QUViRcMEfdZrGo",
    BASIC: "prod_QUVCICoUHBnXb3",
  }

  let subscription = null;
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      const user = await User.findById(session.user.id);
      if (user && user.subscriptionId)
        subscription = await stripe
          .subscriptions
          .retrieve(user.subscriptionId);
    }
  } catch (_) {}

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