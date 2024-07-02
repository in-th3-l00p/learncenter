import React from "react";

import { title } from "@/components/primitives";
import PricingTable from "@/app/pricing/components/PricingTable";

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
  return (
    <div>
      <h1 className={title()}>Pricing</h1>

      {/* @ts-ignore */}
      <PricingTable />
    </div>
  );
}
