import { NextResponse } from "next/server";
import stripe from "stripe";

import User from "@/lib/models/User";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: Request) {
  try {
    const event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature")!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    switch (event.type) {
      case "checkout.session.completed": {
        await User.findOneAndUpdate(
          {
            email: event.data.object.customer_email,
          },
          {
            subscription: event.data.object.subscription,
          },
        );

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
