import { sendEmail } from "./send-email";
import { betterAuth } from "better-auth";
import { D1Database, getDB } from "@workspace/db";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

interface Bindings {
  D1_DATABASE: D1Database;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  RESEND_API_KEY: string;
}

export const auth = (env: Bindings) => {
  const db = getDB(env.D1_DATABASE);

  return betterAuth({
    database: drizzleAdapter(db, { provider: "sqlite" }),
    appName: "OneChat",
    basePath: "/api/v1/auth",
    trustedOrigins: ["http://localhost:3000"],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, token }, request) => {
        const verifyUrl = `http://localhost:3000/verify-email?token=${encodeURIComponent(token)}`;
        
        void sendEmail({
          to: user.email,
          subject: "Verify your email address",
          text: `Click the link to verify your email: ${verifyUrl}`,
        });
      },
    },
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "None",
        secure: true,
        partitioned: true,
        httpOnly: true
      }
    },
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
  });
};
