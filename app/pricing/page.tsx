import React from "react";
import { getServerSession } from "next-auth";

import { title } from "@/components/primitives";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const user = !!session ? await User.findById(session.user.id) : null;

  return (
    <div>
      <h1 className={title()}>Pricing</h1>

      {user && user.subscription === "false" && (
        <div className={"w-full mt-8 rounded-md"}>
          <stripe-pricing-table
            client-referenced-id={session?.user?.id || ""}
            customer-email={session?.user?.email || ""}
            pricing-table-id="prctbl_1PShooDprJ3s8dgPH0Pjztjv"
            publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
          />
        </div>
      )}
    </div>
  );
}
