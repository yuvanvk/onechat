import { sendEmail } from "./send-email";
import { BetterAuthOptions } from "better-auth";

export const betterAuthOptions: BetterAuthOptions = {
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
      const verifyUrl = `http://localhost:3000/verify-email?token=${encodeURIComponent(token)}`
      
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${verifyUrl}`,
      });
    },
  },
} satisfies BetterAuthOptions;
