import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema.js";

export type D1Database = Parameters<typeof drizzle>[0];

export const getDB = (d1: D1Database) => {
    return drizzle(d1, { schema })
}

export * from "./db/schema.js"
export type Schema = typeof schema;
