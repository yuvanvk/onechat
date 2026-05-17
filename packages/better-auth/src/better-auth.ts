import { D1Database, getDB } from "@workspace/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuthOptions } from "./better-auth-options";

interface Bindings {
  D1_DATABASE: D1Database;
}

export const auth = (env: Bindings) => {
  const db = getDB(env.D1_DATABASE)
  
  return betterAuth({
    ...betterAuthOptions,
    database: drizzleAdapter(db, { provider: "sqlite" }),
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
  });
};
