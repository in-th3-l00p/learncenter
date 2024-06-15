import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";

function Subscription() {
  return (
    <div className={"max-w-[300px] w-full h-full border-2 rounded-md"}>
      <h2>Plan 1</h2>
      <ul>
        <li>test</li>
        <li>test</li>
        <li>test</li>
        <li>test</li>
        <li>test</li>
        <li>test</li>
      </ul>

    </div>
  );
}

export default function PricingPage() {
  return (
    <div>
      <h1 className={title()}>Pricing</h1>

      <div className="flex justify-around mt-16">
        <Subscription />
      </div>
    </div>
  );
}
