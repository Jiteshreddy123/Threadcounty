import { PricingCards } from "@/components/pricing/pricing-cards";

export default function PricingPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your fabric analysis needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <PricingCards />
      </div>
    </div>
  );
}
