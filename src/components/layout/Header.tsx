"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { APP_NAME } from "@/lib/constants"
import { Button } from "@/components/ui/Button"

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-50/80 backdrop-blur-md border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="font-serif text-2xl font-semibold tracking-tight text-neutral-900">
              {APP_NAME}
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-20 h-9 bg-neutral-100 rounded-lg animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => signIn("google")}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}