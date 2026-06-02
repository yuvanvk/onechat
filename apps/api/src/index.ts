import { Hono } from "hono";
import ai from "@/routes/ai";
import auth from "@/routes/auth";
import share from "@/routes/share";

import { cors } from "hono/cors";
import { authMiddleware, dbMiddleware } from "@/middleware";
import { Bindings, Variables } from "@/types";

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>({
  strict: false,
});

app.use("*", cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use("*", dbMiddleware);

const routes = [
  { path: "/auth", router: auth },
  { path: "/ai", router: ai },
  { path: "/share", router: share } 
];

const api = app.basePath("/api/v1");
// api.use("/ai/*", authMiddleware);

routes.forEach(({ path, router }) => api.route(path, router));

export { Conversation } from "./durable-object/Conversation";
export default {
  port: 8080,
  fetch: app.fetch,
};
