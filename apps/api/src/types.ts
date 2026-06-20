import { auth } from "@workspace/better-auth/server"
import { getDB } from "@workspace/db"
import { Conversation } from "./durable-object/Conversation"

export type Bindings = {
    D1_DATABASE: D1Database,
    AI: Ai,
    IMAGES_BUCKET: R2Bucket,
    PDFS_BUCKET: R2Bucket,
    CONVERSATION: DurableObjectNamespace<Conversation>,
    R2_SECRET_ACCESS_KEY: string,
    R2_ACCESS_KEY_ID: string,
    R2_API_ENDPOINT: string,
    BETTER_AUTH_URL: string,
    BETTER_AUTH_SECRET: string,
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CLIENT_SECRET: string,
    RESEND_API_KEY: string,
    DODO_PAYMENTS_API_KEY: string,
    DODO_PAYMENTS_RETURN_URL: string,
    DODO_PAYMENTS_WEBHOOK_KEY: string,
    ENVIRONMENT: string
}

type AuthInstance = ReturnType<typeof auth>;
type Session = Awaited<ReturnType<AuthInstance["api"]["getSession"]>>;

export type Variables = {
    db: ReturnType<typeof getDB>,
    session: Session
}