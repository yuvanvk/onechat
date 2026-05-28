import { auth } from "@workspace/better-auth/server"
import { getDB } from "@workspace/db"
import { Conversation } from "./durable-object/Conversation"

export type Bindings = {
    D1_DATABASE: D1Database,
    AI: Ai,
    CONVERSATION: DurableObjectNamespace<Conversation>
    BETTER_AUTH_URL: string,
    BETTER_AUTH_SECRET: string,
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CLIENT_SECRET: string,
    RESEND_API_KEY: string,
}

type AuthInstance = ReturnType<typeof auth>;
type Session = Awaited<ReturnType<AuthInstance["api"]["getSession"]>>;

export type Variables = {
    db: ReturnType<typeof getDB>,
    session: Session
}