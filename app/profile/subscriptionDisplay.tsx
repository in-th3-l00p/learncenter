import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";

import { IUser } from "@/models/User";
import stripe from "@/lib/stripe";

// @ts-ignore
export async function SubscriptionDisplay({ user }: { user: IUser }): any {
  const subscription =
    user && user.subscription !== "false"
      ? await stripe.subscriptions.retrieve(user.subscription)
      : null;

  if (user.subscription === "false") return <p>Your not subscribed</p>;
  const plan = await stripe.plans.retrieve((subscription as any).plan.id);
  const product = await stripe.products.retrieve(plan.product as string);

  return (
    <>
      <p>Current plan: {product.name}</p>
      <p>
        Your subscription is{" "}
        {subscription?.status === "active" ? "active" : "inactive"}
      </p>
      <p>
        Your subscription ends at{" "}
        {new Date(
          subscription?.current_period_end as number,
        ).toLocaleDateString()}
      </p>

      <div className={"mt-4"}>
        <Button
          as={Link}
          href={"https://billing.stripe.com/p/login/test_6oEbMtfpA77DdI4fYY"}
        >
          Manage
        </Button>
      </div>
    </>
  );
}
