import DodoPayments from "dodopayments";
import { Bindings, Variables } from "@/types";
import { user } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>();

router.post("/subscription/cancel", async (c) => {
  try {
    const session = c.get("session");
    const db = c.get("db");

    const client = new DodoPayments({
      bearerToken: c.env.DODO_PAYMENTS_API_KEY,
      environment: "test_mode"
    });

    const query = await db.query.user.findFirst({
      where: eq(user.id, session?.user.id!),
      columns: {
        subscriptionId: true,
      },
    });

    if(!query) {
      return c.json({ message: "No active subscription"}, 404)
    }
    
    const res = await client.subscriptions.update(query.subscriptionId!, {
      cancel_at_next_billing_date: true,
      cancel_reason: "cancelled_by_customer",
      cancellation_feedback: "unused",
    });
    
    return c.json({ message: "Subscription scheduled to be cancelled on next billing cycle" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export default router;
