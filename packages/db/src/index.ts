import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema.js";

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString, { prepare: false });
export const db = drizzle<typeof schema>(client, { schema });

export * from "./db/schema.js"
export type Schema = typeof schema;