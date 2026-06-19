
import { sendEmail } from "./send-email";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { D1Database, getDB } from "@workspace/db";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { customSession } from "better-auth/plugins";

interface Bindings {
  D1_DATABASE: D1Database;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  RESEND_API_KEY: string;
}

const getOptions = (env: Bindings) => {
  const db = getDB(env.D1_DATABASE);

  return {
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
      sendVerificationEmail: async ({ user, token }, _request) => {
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
        httpOnly: true,
      },
    },
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID as string,
        clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    user: {
      additionalFields: {
        plan: {
          type: "string",
          defaultValue: "free",
          input: false,
          fieldName: "plan"
        },
        creditBalance: {
          type: "number",
          defaultValue: 0,
          input: false,
          fieldName: "credit_balance"
        }
      },
    },
  } satisfies BetterAuthOptions;
};

export const auth = (env: Bindings) => {
  const options = getOptions(env);

  return betterAuth({
    ...options,
    plugins: [
      customSession(
        async ({ user, session }) => ({
          user: {
            ...user,
            plan: user.plan ?? "free",
            creditBalance: user.creditBalance ?? 0
          },
          session,
        }),
        options,
      ),
    ],
  });
};

// Export the type so your client can infer `plan` without importing runtime code
export type AuthInstance = ReturnType<typeof auth>;