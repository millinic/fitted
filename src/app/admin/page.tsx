import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { styleGuides, users, styleAssessments, guideFeedback } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Header } from "@/components/layout/Header"
import { AdminDashboard } from "@/components/admin/AdminDashboard"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || session.user.email !== adminEmail) {
    redirect("/")
  }

  const allGuides = await db
    .select({
      guideId: styleGuides.id,
      userId: styleGuides.userId,
      assessmentId: styleGuides.assessmentId,
      status: styleGuides.status,
      guideContent: styleGuides.guideContent,
      founderNotes: styleGuides.founderNotes,
      createdAt: styleGuides.createdAt,
      reviewedAt: styleGuides.reviewedAt,
      deliveredAt: styleGuides.deliveredAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(styleGuides)
    .leftJoin(users, eq(styleGuides.userId, users.id))

  const guideData = await Promise.all(
    allGuides.map(async (guide) => {
      const assessments = await db
        .select()
        .from(styleAssessments)
        .where(eq(styleAssessments.id, guide.assessmentId))
        .limit(1)

      const feedback = await db
        .select()
        .from(guideFeedback)
        .where(eq(guideFeedback.guideId, guide.guideId))

      return {
        ...guide,
        assessment: assessments[0] || null,
        feedback: feedback || [],
      }
    })
  )

  const totalGuides = allGuides.length
  const pendingReviewCount = allGuides.filter((g) => g.status === "pending_review").length
  const completedCount = allGuides.filter(
    (g) => g.status === "approved" || g.status === "delivered"
  ).length
  const allFeedback = guideData.flatMap((g) => g.feedback)
  const ratedFeedback = allFeedback.filter((f) => f.overallRating !== null)
  const avgRating =
    ratedFeedback.length > 0
      ? ratedFeedback.reduce((acc, f) => acc + (f.overallRating || 0), 0) / ratedFeedback.length
      : 0
  const personalizedFeedback = allFeedback.filter((f) => f.feltPersonalized !== null)
  const personalizedRate =
    personalizedFeedback.length > 0
      ? (allFeedback.filter((f) => f.feltPersonalized === true).length /
          personalizedFeedback.length) *
        100
      : 0

  return (
    <>
      <Header />
      <main className="min-h-[80vh]">
        <AdminDashboard
          guides={guideData}
          stats={{
            totalGuides,
            pendingReviewCount,
            completedCount,
            avgRating: isNaN(avgRating) ? 0 : avgRating,
            personalizedRate: isNaN(personalizedRate) ? 0 : personalizedRate,
            totalFeedback: allFeedback.length,
          }}
        />
      </main>
    </>
  )
}