"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const plans = [
  {
    title: "Free",
    description: "Perfect for testing the waters.",
    price: "₹0",
    suffix: "/mo",
    features: [
      { text: "5 AI Analyses per month", included: true },
      { text: "Standard Thread Density", included: true },
      { text: "JPG/PNG Uploads", included: true },
      { text: "PDF Export", included: false },
    ],
    cta: "Get Started",
    href: "/signup",
    variant: "outline" as const,
    highlighted: false,
  },
  {
    title: "Student",
    description: "For academics and researchers.",
    price: "₹749",
    suffix: "/mo",
    features: [
      { text: "50 AI Analyses per month", included: true },
      { text: "Advanced Thread Density", included: true },
      { text: "History Dashboard", included: true },
      { text: "PDF Export", included: true },
    ],
    cta: "Subscribe",
    href: "/signup",
    variant: "outline" as const,
    highlighted: false,
  },
  {
    title: "Professional",
    description: "For QA teams and manufacturers.",
    price: "₹3,999",
    suffix: "/mo",
    badge: "Most Popular",
    features: [
      { text: "Unlimited Analyses", included: true },
      { text: "Highest AI Accuracy", included: true },
      { text: "Detailed Warp/Weft counts", included: true },
      { text: "Priority Support", included: true },
      { text: "Custom PDF Branding", included: true },
    ],
    cta: "Subscribe Now",
    href: "/signup",
    variant: "default" as const,
    highlighted: true,
  },
  {
    title: "Enterprise",
    description: "For large-scale factory operations.",
    price: "Custom",
    suffix: "",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "API Access", included: true },
      { text: "Dedicated Account Manager", included: true },
      { text: "Custom AI Training", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact",
    variant: "outline" as const,
    highlighted: false,
  },
];

export function PricingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.45 }}
        >
          <Card
            className={`flex flex-col h-full interactive-card ${
              plan.highlighted
                ? "border-primary shadow-lg shadow-primary/10 scale-105 z-10 relative"
                : ""
            }`}
          >
            {plan.badge && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
                {plan.badge}
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4 text-4xl font-bold">
                {plan.price}
                {plan.suffix && (
                  <span className="text-lg text-muted-foreground font-normal">{plan.suffix}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map((f) => (
                  <li
                    key={f.text}
                    className={f.included ? "" : "text-muted-foreground/40"}
                  >
                    {f.included ? "✓" : "✗"} {f.text}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href={plan.href} className="w-full">
                <Button variant={plan.variant} className="w-full">{plan.cta}</Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
