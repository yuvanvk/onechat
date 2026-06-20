import { Hono } from "hono";
import { Checkout } from "@dodopayments/hono";
import { Bindings, Variables } from "@/types";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>({
  strict: false,
});

router.get("/", async (c) => {
  try {
    const session = c.get("session");
    const productId = c.req.query("productId");

    const response = await fetch("https://test.dodopayments.com/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${c.env.DODO_PAYMENTS_API_KEY}`,
      },
      body: JSON.stringify({
        product_cart: [
          {
            product_id: productId,
            quantity: 1
          },
        ],
        customer: {
          email: session?.user.email,
          name: session?.user.name,
        },
        return_url: c.env.DODO_PAYMENTS_RETURN_URL,
      }),
    });

    if (!response.ok) {
      return c.json({ message: "Checkout not avaliable" }, 500);
    }

    const result: { checkout_url: string } = await response.json();

    return c.json({ checkout_url: result.checkout_url });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export default router;
