import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import type { NeonHttpDatabase } from "drizzle-orm/neon-http"
import * as schema from "./schema"

type DbType = NeonHttpDatabase<typeof schema>

function createDb(): DbType {
  const url = process.env.DATABASE_URL
  if (!url) {
    return new Proxy({} as DbType, {
      get(_target, prop) {
        if (prop === "then" || prop === "toJSON" || typeof prop === "symbol") {
          return undefined
        }
        throw new Error(
          `DATABASE_URL environment variable is not set. Cannot access db.${String(prop)}`
        )
      },
    })
  }
  const sql = neon(url)
  return drizzle(sql, { schema })
}

export const db: DbType = createDb()