import { dodoClient } from "@/lib/dodo";
import { Bindings, Variables } from "@/types";
import { Hono } from "hono";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>();

router.post("/subscription/cancel", async (c) => {
  try {
    const { subscriptionId } = await c.req.json();

    const updatedSubscription = await dodoClient.subscriptions.update(
      subscriptionId,
      {
        cancel_at_next_billing_date: true,
        cancel_reason: "cancelled_by_customer",
        cancellation_feedback: "unused",
      },
    );

    return c.json({ message: "Subscription cancelled"}, 200)
  } catch (error) {
    console.error(error)
    return c.json({ message: "Internal Server Error"}, 500)
  }
});
