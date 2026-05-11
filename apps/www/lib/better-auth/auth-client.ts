import { createAuthClient } from "@workspace/better-auth/client";

export const authClient = createAuthClient({
    baseURL: "http://localhost:8787",
    basePath: "/api/v1/auth"
})