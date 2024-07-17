import stripe from "@/lib/stripe";
import { Stripe } from "stripe";

const mtrId = "mtr_test_61QmcFtEHuUgXrRAk41DprJ3s8dgPCAy";

export default async function getMaxTokens(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  const product = await stripe.products.retrieve(item.price.product as string);
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  const meterSummary = await stripe.billing.meters.listEventSummaries(mtrId, {
    customer: customer.id,
    start_time: subscription.current_period_start,
    end_time: subscription.current_period_end
  });

  const totalTokens = meterSummary.data.reduce(
    (acc, summary) => acc + summary.aggregated_value,
    0
  );
  const maxTokens = parseInt(product.metadata.tokens) || 0;

  return Math.min(Math.max(maxTokens - totalTokens, 1), 4096);
}