import { Hono } from "hono";
import { Checkout } from "@dodopayments/hono";
import { Bindings, Variables } from "@/types";


const router = new Hono<{ Bindings: Bindings, Variables: Variables }>({ strict: false });

router.get("/", Checkout({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: "test_mode",
    type: "static",
    returnUrl: process.env.DODO_PAYMENTS_RETURN_URL
}));

export default router;