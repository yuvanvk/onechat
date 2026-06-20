import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddleware, dbMiddleware } from "@/middleware";
import { Bindings, Variables } from "@/types";

import auth from "@/routes/auth";
import ai from "@/routes/ai";
import share from "@/routes/share";
import r2 from "@/routes/r2";
import checkout from "@/routes/checkout";
import webhook from "@/routes/webhook";
import settings from "@/routes/settings";

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>({
  strict: false,
});

app.use("*", cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposeHeaders: ["Set-Cookie"],
  credentials: true,
}));

app.use("*", dbMiddleware);

const api = app.basePath("/api/v1");
const protectedApi = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const routes = [
  { path: "/ai", router: ai },
  { path: "/share", router: share },
  { path: "/r2", router: r2 },
  { path: "/checkout", router: checkout },
  { path: "/webhook", router: webhook },
  { path: "/settings", router: settings }
];

protectedApi.use("*", authMiddleware);
routes.forEach(({ path, router }) => protectedApi.route(path, router));

api.route("/auth", auth);
api.route("/", protectedApi);

export { Conversation } from "./durable-object/Conversation";
export default {
  port: 8080,
  fetch: app.fetch,
};
