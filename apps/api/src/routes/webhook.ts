import { Hono } from "hono";
import { Webhooks } from "@dodopayments/hono";
import { Bindings, Variables } from "@/types";
import { creditLedger, user } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>();

router.post("/dodo", (c) => {
  const db = c.get("db");

  return Webhooks({
    webhookKey: c.env.DODO_PAYMENTS_WEBHOOK_KEY!,
    onSubscriptionActive: async (event) => {
      const customereEmail = event.data.customer.email;
      const customerId = event.data.customer.customer_id;

      const [update] = await db
        .update(user)
        .set({
          plan: "pro",
          credit_balance: 200_000,
          subscriptionId: event.data.subscription_id,
          customerId,
          cancelAtNextBillingDate: false,
          updatedAt: new Date(),
        })
        .where(eq(user.email, customereEmail))
        .returning()

      await db.insert(creditLedger).values({
        id: crypto.randomUUID(),
        userId: update.id,
        type: "grant",
        amount: 200_000,
        createdAt: new Date(),
      });
    },
    onSubscriptionRenewed: async (event) => {
      const customerId = event.data.customer.customer_id;

      const [update] = await db
        .update(user)
        .set({
          credit_balance: 200_000,
          cancelAtNextBillingDate: false,
          updatedAt: new Date(),
        })
        .where(eq(user.customerId, customerId))
        .returning()

      await db.insert(creditLedger).values({
        id: crypto.randomUUID(),
        userId: update.id,
        type: "grant",
        amount: 200_000,
        createdAt: new Date(),
      });
    },
    onSubscriptionUpdated: async (event) => {
      const customerId = event.data.customer.customer_id;
      // Don't downgrade yet — they paid through the end of period
      console.log("Cancellation event:", JSON.stringify(event, null, 2));
      console.log("customerId from Dodo:", customerId);
      console.log(event.data.status);
      
      const [update] = await db
        .update(user)
        .set({
          cancelAtNextBillingDate: true,
          updatedAt: new Date(),
        })
        .where(eq(user.customerId, customerId))
        .returning()

      console.log(update);
      
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
        .where(eq(user.customerId, customerId));
    },
    onPaymentFailed: async (event) => {
      console.warn(
        "Payment failed for customer:",
        event.data.customer?.customer_id,
      );
    },
  })(c);
});

export default router;
