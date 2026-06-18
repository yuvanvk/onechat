import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CreditCard,
  Info,
  SquareArrowOutUpRight,
} from "lucide-react";
import { motion } from "motion/react";

// --- Mock data shape — swap with real data from your billing API ---
const creditBalance = {
  renewsInDays: 20,
  card: {
    label: "yuvan",
    amount: 4.99,
  },
  gifted: { used: 0, total: 0 },
  monthly: { used: 4.99, total: 5.0 },
  purchased: { used: 0, total: 0 },
};

// Total available = sum of used amounts across all credit types
// (matches the screenshot, where "used" doubles as "available" while credits are unexpired)
const totalAvailableCredits =
  creditBalance.gifted.used +
  creditBalance.monthly.used +
  creditBalance.purchased.used;

const expirationSchedule = [
  { type: "Monthly", used: 4.99, total: 5.0, expiration: "Aug 11, 2026" },
];

const usedAndExpired = [
  { type: "Monthly", used: 4.98, total: 5.0, expiration: "Jul 12, 2026" },
  { type: "Monthly", used: 4.91, total: 5.0, expiration: "May 12, 2026" },
];

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

export const Billing = () => {
  const router = useRouter();

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

      <div className="w-full flex flex-col gap-5 mt-10">
        <h2 className="text-muted-foreground font-medium pl-1">Current Plan</h2>

        <div className="w-full border border-accent dark:bg-[#121212] rounded-lg flex items-center justify-between p-3">
          <div className="flex flex-col gap-1">
            <div>
              <span className="font-medium">Free Plan</span>
              <span className="text-muted-foreground ml-2">$0/mo</span>
            </div>
            <span className="text-muted-foreground">
              Includes $5 credits every month.
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
            <Button size={"sm"}>Upgrade</Button>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-5 mt-10">
        <div className="w-full border border-accent dark:bg-[#121212] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-3">
            <div className="flex flex-col gap-1">
              <span className="font-medium">Credit Balance</span>
              <span className="text-muted-foreground">
                Your monthly credits renew in{" "}
                <span className="text-foreground font-medium">
                  {creditBalance.renewsInDays} days
                </span>
                . Unused monthly credits do not roll over.
              </span>
            </div>
            <Button size={"sm"} variant={"outline"}>
              Upgrade
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
                  {formatCurrency(creditBalance.card.amount)}
                </span>
                <span className="text-foreground">
                  {creditBalance.card.label}
                </span>
              </div>
            </motion.div>

            {/* Breakdown rows */}
            <div className="flex-1 flex flex-col rounded-md overflow-hidden ">
              <div className="flex items-center justify-between px-2 py-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  Gifted Credits
                  <Info className="size-3.5" />
                </span>
                <span>{formatCurrency(creditBalance.gifted.used)}</span>
              </div>

              <div className="flex items-center justify-between px-2 py-2.5 bg-neutral-200/50 dark:bg-black rounded-lg">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  Monthly Credits
                  <Info className="size-3.5" />
                </span>
                <span>
                  {formatCurrency(creditBalance.monthly.used)} /{" "}
                  {formatCurrency(creditBalance.monthly.total)}
                </span>
              </div>

              <div className="flex items-center justify-between px-2 py-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  Purchased Credits
                  <Info className="size-3.5" />
                </span>
                <span>{formatCurrency(creditBalance.purchased.used)}</span>
              </div>

              <div className="flex items-center justify-between px-2 py-2.5 bg-neutral-200/50 dark:bg-black font-medium rounded-lg">
                <span>Total Available Credits</span>
                <span>{formatCurrency(totalAvailableCredits)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-5 mt-10">
        <div className="w-full border border-accent  dark:bg-[#121212] rounded-lg overflow-hidden">
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
