import { neon } from "@neondatabase/serverless"
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http"
import * as schema from "./schema"

function createDb(): NeonHttpDatabase<typeof schema> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  const sql = neon(databaseUrl)
  return drizzle(sql, { schema })
}

let _db: NeonHttpDatabase<typeof schema> | null = null

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    _db = createDb()
  }
  return _db
}

// For environments where DATABASE_URL is always set at import time (production),
// this works fine. For build-time / edge cases where it may not be set,
// we lazily initialize.
export const db: NeonHttpDatabase<typeof schema> = new Proxy(
  {} as NeonHttpDatabase<typeof schema>,
  {
    get(_target, prop, receiver) {
      const instance = getDb()
      const value = Reflect.get(instance, prop, receiver)
      if (typeof value === "function") {
        return value.bind(instance)
      }
      return value
    },
    has(_target, prop) {
      return Reflect.has(getDb(), prop)
    },
    ownKeys() {
      return Reflect.ownKeys(getDb())
    },
    getOwnPropertyDescriptor(_target, prop) {
      return Reflect.getOwnPropertyDescriptor(getDb(), prop)
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(getDb())
    },
  }
) as NeonHttpDatabase<typeof schema>