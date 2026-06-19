import { Hono } from "hono";
import { Webhooks } from "@dodopayments/hono";
import { Bindings, Variables } from "@/types";
import { user } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>();

router.post("/dodo", (c) => {
  const db = c.get("db");

  return Webhooks({
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,
    onSubscriptionActive: async (event) => {
      const customerId = event.data.customer.customer_id;

      await db
        .update(user)
        .set({
          plan: "pro",
          credit_balance: 200_000,
          subscriptionId: event.data.subscription_id,
          cancelAtNextBillingDate: false,
          updatedAt: new Date(),
        })
        .where(eq(user.id, customerId));
    },
    onSubscriptionRenewed: async (event) => {
      const customerId = event.data.customer.customer_id;

      await db
        .update(user)
        .set({
          credit_balance: 500_000,
          cancelAtNextBillingDate: false,
          updatedAt: new Date(),
        })
        .where(eq(user.id, customerId));
    },
    onSubscriptionCancellationScheduled: async (event) => {
      const customerId = event.data.customer.customer_id;
      // Don't downgrade yet — they paid through the end of period
      await db
        .update(user)
        .set({
          cancelAtNextBillingDate: true,
          updatedAt: new Date(),
        })
        .where(eq(user.id, customerId));
    },
    onSubscriptionCancelled: async (event) => {
      const customerId = event.data.customer.customer_id;
      await db
        .update(user)
        .set({
          plan: "free",
          credit_balance: 10_000,
          reserved_credits: 0,
          subscriptionId: null,
          cancelAtNextBillingDate: false,
          updatedAt: new Date(),
        })
        .where(eq(user.id, customerId));
    },
    onPaymentFailed: async (event) => {
        console.warn("Payment failed for customer:", event.data.customer?.customer_id);
    },
  })(c);
});

export default router;
