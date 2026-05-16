import { D1Database, getDB } from "@workspace/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuthOptions } from "./better-auth-options";

interface Bindings {
  D1DATABASE: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}

export const auth = (env: Bindings) => {
  const db = getDB(env.D1DATABASE)
  
  return betterAuth({
    ...betterAuthOptions,
    database: drizzleAdapter(db, { provider: "sqlite" }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
  });
};
