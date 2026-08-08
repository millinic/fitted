import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import GoogleProvider from "next-auth/providers/google"

function buildAuthOptions(): NextAuthOptions {
  // Lazy import to avoid triggering DB connection at module load / build time
  const { getDb } = require("@/lib/db")
  return {
    adapter: DrizzleAdapter(getDb()) as any,
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
      session({ session, token }) {
        if (session.user && token.sub) {
          (session.user as any).id = token.sub
        }
        return session
      },
      jwt({ token, user }) {
        if (user) {
          token.sub = user.id as string
        }
        return token
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
}

let _handler: ReturnType<typeof NextAuth> | undefined

function getHandler() {
  if (!_handler) {
    _handler = NextAuth(buildAuthOptions())
  }
  return _handler
}

export async function GET(...args: any[]) {
  return (getHandler() as any)(...args)
}

export async function POST(...args: any[]) {
  return (getHandler() as any)(...args)
}