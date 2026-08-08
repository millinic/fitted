import { neon } from "@neondatabase/serverless"
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http"
import * as schema from "./schema"

type Database = NeonHttpDatabase<typeof schema>

let _db: Database | undefined

export function getDb(): Database {
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set")
    }
    const sql = neon(databaseUrl)
    _db = drizzle(sql, { schema })
  }
  return _db
}

// For convenience: a lazy-initialized db export.
// We use a getter so the actual connection is only created on first property access.
export const db: Database = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    const realDb = getDb()
    const value = (realDb as any)[prop]
    if (typeof value === "function") {
      return value.bind(realDb)
    }
    return value
  },
})