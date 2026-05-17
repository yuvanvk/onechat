import { auth } from "@workspace/better-auth/server"
import { getDB } from "@workspace/db"

export type Bindings = {
    D1_DATABASE: D1Database,
    OPENROUTER_API_KEY: string,
    BETTER_AUTH_URL: string,
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CLIENT_SECRET: string,
    RESEND_API_KEY: string,
    UPSTASH_REDIS_REST_URL: string,
    UPSTASH_REDIS_REST_TOKEN: string
}

type AuthInstance = ReturnType<typeof auth>;
type Session = Awaited<ReturnType<AuthInstance["api"]["getSession"]>>;

export type Variables = {
    db: ReturnType<typeof getDB>,
    session: Session
}