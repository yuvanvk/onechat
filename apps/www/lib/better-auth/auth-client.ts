import {
  createAuthClient,
  customSessionClient,
} from "@workspace/better-auth/client";
import type { AuthInstance } from "@workspace/better-auth/server";
import { BACKEND_URL } from "@/lib/config";

export const authClient = createAuthClient({
  baseURL: BACKEND_URL,
  basePath: "/api/v1/auth",
  plugins: [
    customSessionClient<AuthInstance>(),
  ],
  fetchOptions: {
    credentials: "include",
  },
});
