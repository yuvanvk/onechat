import { Hono } from "hono";
import auth from "@/routes/auth";
import ai from "@/routes/ai";
import { cors } from "hono/cors";



const app = new Hono({
  strict: false,
});

app.use("*", cors({
  // Must match the browser Origin header exactly (no trailing slash).
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

const routes = [
  { path: "/auth", router: auth },
  { path: "/ai", router: ai },
];

const api = app.basePath("/api/v1");
routes.forEach(({ path, router }) => api.route(path, router));

export default {
  port: 8080,
  fetch: app.fetch,
};
