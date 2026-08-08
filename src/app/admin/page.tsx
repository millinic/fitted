import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { styleGuides, assessments, styleProfiles, payments } from "@/lib/db/schema"
import { eq, desc, count } from "drizzle-orm"
import { Header } from "@/components/layout/Header"
import { AdminDashboard } from "@/components/admin/AdminDashboard"

export const metadata = {
  title: "Admin — Fitted",
  description: "Founder review dashboard.",
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  const adminEmail = process.env.ADMIN_EMAIL
  if (!session?.user?.email || session.user.email !== adminEmail) {
    redirect("/")
  }

  const db = getDb()

  const guides = await db
    .select({
      guideId: styleGuides.id,
      assessmentId: styleGuides.assessmentId,
      status: styleGuides.status,
      createdAt: styleGuides.createdAt,
      founderNotes: styleGuides.founderNotes,
      introduction: styleGuides.introduction,
      recommendations: styleGuides.recommendations,
      lookbooks: styleGuides.lookbooks,
      generalAdvice: styleGuides.generalAdvice,
      firstName: assessments.firstName,
      lastName: assessments.lastName,
      location: assessments.location,
      styleArchetype: styleProfiles.styleArchetype,
      bodyType: assessments.bodyType,
      fitPreference: assessments.fitPreference,
      budgetRange: assessments.budgetRange,
      styleGoal: assessments.styleGoal,
    })
    .from(styleGuides)
    .leftJoin(assessments, eq(styleGuides.assessmentId, assessments.id))
    .leftJoin(styleProfiles, eq(styleGuides.styleProfileId, styleProfiles.id))
    .orderBy(desc(styleGuides.createdAt))

  const totalAssessments = await db.select({ count: count() }).from(assessments)
  const totalPayments = await db.select({ count: count() }).from(payments)

  const stats = {
    totalAssessments: totalAssessments[0]?.count ?? 0,
    totalPayments: totalPayments[0]?.count ?? 0,
    pendingReview: guides.filter((g) => g.status === "pending_review").length,
    totalGuides: guides.length,
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        <AdminDashboard guides={guides} stats={stats} />
      </main>
    </>
  )
}