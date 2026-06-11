import { getDB } from "@workspace/db";

export class Db {
    private static instance: ReturnType<typeof getDB> | null = null

    static initDB(d1: D1Database) {
        if(Db.instance) return
        Db.instance = getDB(d1);
    }

    static get() {
        if(!Db.instance) {
            throw new Error("DB not initialized");
        }
        return Db.instance;
    }
}