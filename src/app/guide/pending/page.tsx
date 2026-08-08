import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Card } from "@/components/ui/Card"
import { db } from "@/lib/db"
import { styleGuides } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { GUIDE_DELIVERY_DAYS_MIN, GUIDE_DELIVERY_DAYS_MAX } from "@/lib/constants"
import Link from "next/link"

export default async function GuidePendingPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const guides = await db
    .select()
    .from(styleGuides)
    .where(eq(styleGuides.userId, session.user.id))
    .limit(1)

  const guide = guides[0]

  if (guide?.status === "approved" || guide?.status === "delivered") {
    redirect("/guide")
  }

  return (
    <>
      <Header />
      <main className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          <Card padding="lg" className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-accent-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-accent-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 mb-3">
              Your Guide is Being Prepared
            </h1>
            <p className="text-brand-600 mb-6 leading-relaxed">
              Thank you for your purchase! Your personalized style guide has been generated
              and is now being reviewed by our expert stylist to ensure every recommendation
              is perfect for you.
            </p>
            <div className="bg-brand-100 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-brand-800">
                Expected delivery: {GUIDE_DELIVERY_DAYS_MIN}–{GUIDE_DELIVERY_DAYS_MAX} business days
              </p>
              <p className="text-xs text-brand-600 mt-1">
                You&apos;ll receive an email when your guide is ready.
              </p>
            </div>
            <Link
              href="/guide"
              className="text-sm text-accent-600 hover:text-accent-800 transition-colors font-medium"
            >
              Check guide status →
            </Link>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}