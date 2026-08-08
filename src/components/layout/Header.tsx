"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/Button"
import { APP_NAME } from "@/lib/constants"

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 bg-brand-50/80 backdrop-blur-md border-b border-brand-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-bold text-brand-950 tracking-tight">
          {APP_NAME}
        </Link>

        <nav className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="w-20 h-9 bg-brand-200 rounded-lg animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <Link href="/guide" className="text-sm text-brand-700 hover:text-brand-950 transition-colors">
                My Guide
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => signIn("google")}>
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}