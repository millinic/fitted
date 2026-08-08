import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { assessments, styleGuides } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Card } from "@/components/ui/Card"
import Link from "next/link"

export const metadata = {
  title: "Dashboard — Fitted",
  description: "View your style guides and assessments.",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const db = getDb()

  const userAssessments = await db.query.assessments.findMany({
    where: eq(assessments.userId, session.user.id),
    orderBy: desc(assessments.createdAt),
  })

  const userGuides = await db.query.styleGuides.findMany({
    where: eq(styleGuides.userId, session.user.id),
    orderBy: desc(styleGuides.createdAt),
  })

  const statusColors: Record<string, string> = {
    approved: "bg-success/10 text-success",
    delivered: "bg-success/10 text-success",
    pending_review: "bg-warning/10 text-warning",
    generating: "bg-blue-50 text-blue-600",
    revision_requested: "bg-orange-50 text-orange-600",
  }

  const statusLabels: Record<string, string> = {
    approved: "Ready",
    delivered: "Delivered",
    pending_review: "Under Review",
    generating: "Generating",
    revision_requested: "Being Refined",
  }

  return (
    <>
      <Header />
      <main className="pt-16 bg-brand-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-serif text-neutral-900 mb-2">
            Welcome back, {session.user.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-neutral-600 mb-10">Here are your style guides and assessments.</p>

          {userGuides.length === 0 && userAssessments.length === 0 ? (
            <Card variant="elevated" className="text-center py-12">
              <h2 className="font-serif text-xl text-neutral-900 mb-3">No guides yet</h2>
              <p className="text-neutral-600 mb-6">
                Complete a style assessment to get your personalized wardrobe guide.
              </p>
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
              >
                Start Assessment
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {userGuides.map((guide) => (
                <Link key={guide.id} href={`/guide/${guide.assessmentId}`}>
                  <Card variant="bordered" className="hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-neutral-900">Style Guide</h3>
                        <p className="text-sm text-neutral-500">
                          Created {guide.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[guide.status] || "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {statusLabels[guide.status] || guide.status}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}

              {userAssessments
                .filter((a) => !userGuides.some((g) => g.assessmentId === a.id))
                .map((assessment) => (
                  <Link key={assessment.id} href={`/profile/${assessment.id}`}>
                    <Card variant="bordered" className="hover:shadow-md transition-shadow cursor-pointer mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-neutral-900">Assessment Completed</h3>
                          <p className="text-sm text-neutral-500">
                            {assessment.createdAt.toLocaleDateString()} — View your style profile
                          </p>
                        </div>
                        <span className="text-sm text-brand-600 font-medium">View →</span>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}