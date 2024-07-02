import { NextResponse } from "next/server";
import stripe from "stripe";

import User from "@/models/User";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: Request) {
  try {
    const event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature")!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await User.findOneAndUpdate({
            customerId: event.data.object.customer,
          }, {
            subscriptionId: event.data.object.id,
          });

        break;
      case "customer.subscription.deleted":
        await User.findOneAndUpdate({
            customerId: event.data.object.customer,
          }, {
            subscriptionId: null,
          });

        break;
      case "checkout.session.completed": {
        await User.findOneAndUpdate( {
            customerId: event.data.object.customer,
          }, {
            subscriptionId: event.data.object.subscription,
          });

        break;
      }
    }
  } catch (err) {
    return NextResponse.json(err, {
      status: 400,
    } as ResponseInit);
  }

  return NextResponse.json({});
}
