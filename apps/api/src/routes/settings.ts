import { Bindings, Variables } from "@/types";
import { user } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const router = new Hono<{ Bindings: Bindings, Variables: Variables }>();


router.patch('/update/user/:id', async (c) => {
    try {
        const db = c.get("db");

        const id = c.req.param("id");
        const { name } = await c.req.json();

        await db.update(user).set({ name }).where(eq(user.id, id));

        return c.json({ message: "Username updated successfully."}, 200)
    } catch (error) {
        console.error(error)
        return c.json({ message: "Internal Server Error"}, 500)
    }
});

