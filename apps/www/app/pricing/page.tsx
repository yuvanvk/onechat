"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";

type PlanFeature = {
  label: string;
};

type Plan = {
  name: string;
  price: string;
  period: string;
  badge?: string;
  features: PlanFeature[];
  cta: string;
  ctaVariant: "outline" | "default";
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: [
      { label: "Access to free models" },
      { label: "$2 of included monthly credits" },
      { label: "7 messages/day limit" },
      { label: "Text-only conversations" },
    ],
    cta: "Start Building",
    ctaVariant: "outline",
  },
  {
    name: "Pro",
    price: "$20",
    period: "/month",
    badge: "Popular",
    features: [
      { label: "Access to all premium models" },
      { label: "$20 of included monthly credits" },
      { label: "Unlimited messages, capped by credit usage" },
      { label: "Upload images and PDFs" },
      { label: "Generate images" },
    ],
    cta: "Select Plan",
    ctaVariant: "default",
    highlighted: true,
  },
];

export default function Pricing() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto w-full py-16 flex flex-col items-center tracking-tight relative">
      <Button variant={"outline"} onClick={() => router.back()} className="absolute left-0">
        <ArrowLeft />
      </Button>
      <h1 className="font-medium text-4xl tracking-tight text-center">
        Plans and Pricing
      </h1>

      <div className="w-full flex flex-col gap-5 mt-16">
        <h2 className="text-muted-foreground font-medium pl-1">
          Individual Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-lg dark:bg-[#121212] ${
                plan.highlighted
                  ? "border-2 border-teal-500 "
                  : "border border-accent"
              }`}
            >
              <div className="p-6 flex flex-col gap-6 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-3xl tracking-tight">
                    {plan.name}
                  </span>
                  {plan.badge && (
                    <span className="bg-teal-500 text-teal-950 text-xs font-medium px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-medium tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <div className="flex flex-col">
                  {plan.features.map((feature, i) => (
                    <div
                      key={feature.label}
                      className={`flex items-center gap-3 py-3 ${
                        i !== plan.features.length - 1
                          ? "border-b border-accent"
                          : ""
                      }`}
                    >
                      <span className="flex items-center justify-center size-5 rounded-full bg-accent shrink-0">
                        <Check className="size-3" />
                      </span>
                      <span className="text-sm">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 pt-0">
                <Button
                  size={"lg"}
                  variant={plan.ctaVariant}
                  className="w-full"
                  onClick={() =>
                    router.push(
                      `/billing/checkout?plan=${plan.name.toLowerCase()}`,
                    )
                  }
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
