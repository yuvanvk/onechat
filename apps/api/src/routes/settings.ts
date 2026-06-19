import { Bindings, Variables } from "@/types";
import { user } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const router = new Hono<{ Bindings: Bindings, Variables: Variables }>();

router.patch('/update/user', async (c) => {
    try {
        const db = c.get("db");
        const session = c.get("session");
        const { name } = await c.req.json();

        await db.update(user).set({ name }).where(eq(user.id, session?.user.id!));

        return c.json({ message: "Username updated successfully."}, 200);
    } catch (error) {
        console.error(error)
        return c.json({ message: "Internal Server Error"}, 500)
    }
});

export default router;