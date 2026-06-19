import {
  createAuthClient,
  customSessionClient,
} from "@workspace/better-auth/client";
import { AuthInstance } from "@workspace/better-auth/server";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8787",
  basePath: "/api/v1/auth",
  plugins: [
    customSessionClient<AuthInstance>(),
  ],
  fetchOptions: {
    credentials: "include",
  },
});
