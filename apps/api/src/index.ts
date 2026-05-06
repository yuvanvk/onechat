import { Hono } from 'hono'
import auth from '@/routes/auth'
import ai from "@/routes/ai";

const app = new Hono({
  strict: false
});

const routes = [auth, ai]

routes.forEach((route) => (
  app.basePath("/api/v1").route("/", route)
));

export default app
