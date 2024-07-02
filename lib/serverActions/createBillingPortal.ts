import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { UnauthorizedResponse } from "@/app/api/utils";
import User from "@/models/User";
import stripe from "@/lib/stripe";
import { redirect } from "next/navigation";

export default async function createBillingPortal() {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) return UnauthorizedResponse;

  const user = await User.findById(session.user.id);
  if (!user) return;

  if (!user.subscriptionId || !user.customerId)
    return;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.customerId,
    return_url: `${process.env.NEXTAUTH_URL}/account`,
  });

  return redirect(portalSession.url);
}
