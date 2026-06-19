import { createMiddleware } from "hono/factory";
import { Bindings, Variables } from "./types";
import { auth } from "@workspace/better-auth/server";
import { getDB } from "@workspace/db";

export const authMiddleware = createMiddleware<{ Bindings: Bindings, Variables: Variables }>(async (c, next) => {
    const betterAuth= auth(c.env);

    const session = await betterAuth.api.getSession({ headers: c.req.raw.headers });
    
    if(!session) {
        return c.json({ message: "UNAUTHORIZED" }, 401)
    }

    c.set("session", session);
    return next()
})


export const dbMiddleware = createMiddleware<{ Bindings: Bindings, Variables: Variables }>(async (c, next) => {
    const db = getDB(c.env.D1_DATABASE);
    c.set("db", db);
    return next()  
})

export const checkoutMiddleware = createMiddleware<{Bindings: Bindings, Variables: Variables}>(async (c, next) => {
    const session = c.get("session");
    if(session?.user.plan === "pro") {
        return c.json({ message: "Already on Pro Plan"}, 400)
    }
    await next();
})