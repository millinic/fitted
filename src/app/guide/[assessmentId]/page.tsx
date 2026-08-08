import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { assessments, styleProfiles, styleGuides } from "@/lib/db/schema"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { GuideView } from "@/components/guide/GuideView"
import { GuidePending } from "@/components/guide/GuidePending"

export const metadata = {
  title: "Your Style Guide — Fitted",
  description: "Your personalized wardrobe guide.",
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ assessmentId: string }>
}) {
  const { assessmentId } = await params
  const db = getDb()

  const assessment = await db.query.assessments.findFirst({
    where: eq(assessments.id, assessmentId),
  })

  if (!assessment) {
    notFound()
  }

  const profile = await db.query.styleProfiles.findFirst({
    where: eq(styleProfiles.assessmentId, assessmentId),
  })

  const guide = await db.query.styleGuides.findFirst({
    where: eq(styleGuides.assessmentId, assessmentId),
  })

  if (!guide) {
    return (
      <>
        <Header />
        <main className="pt-16">
          <GuidePending
            firstName={assessment.firstName || "there"}
            status="generating"
            assessmentId={assessmentId}
          />
        </main>
        <Footer />
      </>
    )
  }

  if (guide.status !== "approved" && guide.status !== "delivered") {
    return (
      <>
        <Header />
        <main className="pt-16">
          <GuidePending
            firstName={assessment.firstName || "there"}
            status={guide.status}
            assessmentId={assessmentId}
          />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        <GuideView
          firstName={assessment.firstName || "there"}
          archetype={profile?.styleArchetype || ""}
          guide={{
            introduction: guide.introduction || "",
            recommendations: (guide.recommendations as any) || [],
            lookbooks: (guide.lookbooks as any) || [],
            generalAdvice: guide.generalAdvice || "",
          }}
        />
      </main>
      <Footer />
    </>
  )
}