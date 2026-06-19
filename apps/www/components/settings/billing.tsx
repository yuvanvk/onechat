import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CreditCard,
  Info,
  SquareArrowOutUpRight,
} from "lucide-react";
import { motion } from "motion/react";
import { authClient } from "@/lib/better-auth/auth-client";
import { useEffect } from "react";



const CREDIT_VALUE = 0.0001;

const PLAN_CREDITS = {
  free: 20_000, // $2/mo
  pro: 200_000, // $20/mo
} as const;

const toDollars = (credits: number) => credits * CREDIT_VALUE;
const formatCurrency = (value: number) => `$${value.toFixed(4)}`;
const formatCurrencyShort = (value: number) => `$${value.toFixed(2)}`;

// ─── Mock data (swap expiration schedule with real API data later) ────────────

const expirationSchedule = [
  { type: "Monthly", used: 4.99, total: 5.0, expiration: "Aug 11, 2026" },
];

const usedAndExpired = [
  { type: "Monthly", used: 4.98, total: 5.0, expiration: "Jul 12, 2026" },
  { type: "Monthly", used: 4.91, total: 5.0, expiration: "May 12, 2026" },
];

export const Billing = () => {
  const router = useRouter();
  const { data } = authClient.useSession();

  const plan: "free" | "pro" = data?.user.plan === "pro" ? "pro" : "free";
  const creditBalance = data?.user.creditBalance ?? 0;

  const totalPlanCredits = PLAN_CREDITS[plan];
  const usedCredits = totalPlanCredits - creditBalance;

  const creditBalanceUSD = toDollars(creditBalance);
  const totalPlanUSD = toDollars(totalPlanCredits);
  const usedUSD = toDollars(usedCredits);

  const renewsInDays = 20; // TODO: calculate from subscription renewal date

  useEffect(() => {
    if (!data?.session) {
      router.push("/signup");
    }
  }, [data?.session]);

  async function handleCheckout() {
    const response = await fetch(
      "http://localhost:8787/api/v1/checkout?productId=pdt_0NhMGl6F8wOpuZwSc8tP3&customer_id=HfbevZyJ8HESjJOlcA6KJFGyM3lZVrjs",
      { credentials: "include" },
    );
    const json = await response.json();
    redirect(json.checkout_url);
  }

  return (
    <div className="max-w-3xl mx-auto w-full py-12 flex flex-col tracking-tight text-sm">
      <div className="flex items-center gap-2">
        <Button
          size={"icon-lg"}
          variant={"ghost"}
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </Button>
        <h1 className="font-medium text-2xl tracking-tight">Billing</h1>
      </div>

      {/* ── Current Plan ── */}
      <div className="w-full flex flex-col gap-5 mt-10">
        <h2 className="text-muted-foreground font-medium pl-1">Current Plan</h2>

        <div className="w-full border border-accent dark:bg-[#121212] rounded-lg flex items-center justify-between p-3">
          <div className="flex flex-col gap-1">
            <div>
              <span className="font-medium">
                {plan === "free" ? "Free Plan" : "Pro Plan"}
              </span>
              <span className="text-muted-foreground ml-2">
                {plan === "free" ? "$0/mo" : "$20/mo"}
              </span>
            </div>
            <span className="text-muted-foreground">
              Includes {plan === "free" ? "$2" : "$20"} credits every month.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => router.push("/pricing")}
            >
              View Plans
              <SquareArrowOutUpRight />
            </Button>
            <Button
              size={"sm"}
              onClick={async () => {
                if (plan === "free") await handleCheckout();
              }}
            >
              {plan === "free" ? "Upgrade" : "Cancel Plan"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Credit Balance ── */}
      <div className="w-full flex flex-col gap-5 mt-10">
        <div className="w-full border border-accent dark:bg-[#121212] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-3">
            <div className="flex flex-col gap-1">
              <span className="font-medium">Credit Balance</span>
              <span className="text-muted-foreground">
                Your monthly credits renew in{" "}
                <span className="text-foreground font-medium">
                  {renewsInDays} days
                </span>
                . Unused monthly credits do not roll over.
              </span>
            </div>
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={async () => {
                if (plan === "free") await handleCheckout();
              }}
            >
              {plan === "free" ? "Upgrade" : "Cancel Plan"}
            </Button>
          </div>

          <div className="h-px bg-accent" />

          <div className="flex gap-8 px-4 py-3 items-center">
            {/* Card visual */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", damping: 10, duration: 0.2 }}
              className="w-55 h-35 shrink-0 bg-linear-to-br from-bg-neutral-400 to-bg-neutral-600 dark:from-[#1c1c1c] dark:to-[#0a0a0a] border border-accent p-4 flex flex-col justify-between rounded-xl"
            >
              <div className="self-end text-muted-foreground">
                <CreditCard className="size-6" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-semibold tracking-tight">
                  {formatCurrency(creditBalanceUSD)}
                </span>
                <span className="text-foreground">
                  {data?.user.name ?? "—"}
                </span>
              </div>
            </motion.div>

            {/* Breakdown rows */}
            <div className="flex-1 flex flex-col rounded-md overflow-hidden">
              <div className="flex items-center justify-between px-2 py-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  Gifted Credits
                  <Info className="size-3.5" />
                </span>
                <span>{formatCurrencyShort(0)}</span>
              </div>

              <div className="flex items-center justify-between px-2 py-2.5 bg-neutral-200/50 dark:bg-black rounded-lg">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  Monthly Credits
                  <Info className="size-3.5" />
                </span>
                <span>
                  {formatCurrencyShort(usedUSD)} /{" "}
                  {formatCurrencyShort(totalPlanUSD)}
                </span>
              </div>

              <div className="flex items-center justify-between px-2 py-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  Purchased Credits
                  <Info className="size-3.5" />
                </span>
                <span>{plan === "free" ? "$0" : "$20.00"}</span>
              </div>

              <div className="flex items-center justify-between px-2 py-2.5 bg-neutral-200/50 dark:bg-black font-medium rounded-lg">
                <span>Total Available Credits</span>
                <span>{formatCurrency(creditBalanceUSD)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Expiration Schedule ── */}
      <div className="w-full flex flex-col gap-5 mt-10">
        <div className="w-full border border-accent dark:bg-[#121212] rounded-lg overflow-hidden">
          <div className="p-3">
            <span className="font-medium">Credit Expiration Schedule</span>
          </div>

          <div className="grid grid-cols-3 px-3 pb-2 text-muted-foreground">
            <span>Type</span>
            <span>Credit Balance</span>
            <span className="text-right">Expiration</span>
          </div>

          {expirationSchedule.map((row, i) => (
            <div key={i} className="grid grid-cols-3 px-3 py-2.5">
              <span className="font-medium">{row.type}</span>
              <span className="text-muted-foreground">
                {formatCurrency(row.used)} / {formatCurrency(row.total)}
              </span>
              <span className="text-muted-foreground text-right">
                {row.expiration}
              </span>
            </div>
          ))}

          <div className="h-px bg-accent mt-2" />

          <div className="p-3">
            <span className="font-medium">
              Used and Expired Credits Over Past 3 Months
            </span>
          </div>

          <div className="grid grid-cols-3 px-5 text-[13px] pb-2 text-muted-foreground">
            <span>Type</span>
            <span>Credit Balance</span>
            <span className="text-right">Expiration</span>
          </div>

          <div className="px-3 pb-3">
            {usedAndExpired.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 p-2 rounded-lg ${
                  i % 2 === 1 ? "bg-neutral-200/50 dark:bg-black" : ""
                }`}
              >
                <span className="font-medium">{row.type}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(row.used)} / {formatCurrency(row.total)}
                </span>
                <span className="text-muted-foreground text-right">
                  {row.expiration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
