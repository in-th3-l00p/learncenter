import { Button } from "@nextui-org/button";

import { IUser } from "@/models/User";
import stripe from "@/lib/stripe";
import createBillingPortal from "@/lib/serverActions/createBillingPortal";

// @ts-ignore
export async function SubscriptionDisplay({ user }: { user: IUser }): any {

  const subscription =
    user && user.subscriptionId
      ? await stripe.subscriptions.retrieve(user.subscriptionId)
      : null;

  if (!user.subscriptionId) return <p>Your not subscribed</p>;
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

      <form
        action={createBillingPortal}
        className={"mt-4"}
      >
        <Button
          type={"submit"}
        >
          Manage
        </Button>
      </form>
    </>
  );
}
