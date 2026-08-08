import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/layout/Header"
import { FeedbackForm } from "@/components/guide/FeedbackForm"

export const metadata = {
  title: "Feedback — Fitted",
  description: "Share your feedback on your personalized style guide.",
}

export default async function FeedbackPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/guide/feedback")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-50 pt-24 pb-16">
        <Suspense
          fallback={
            <div className="max-w-xl mx-auto px-4 animate-pulse">
              <div className="h-8 bg-neutral-200 rounded w-48 mb-4" />
              <div className="h-64 bg-neutral-200 rounded-2xl" />
            </div>
          }
        >
          <FeedbackForm />
        </Suspense>
      </main>
    </>
  )
}