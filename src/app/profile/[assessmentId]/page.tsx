import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { assessments, styleProfiles } from "@/lib/db/schema"
import { Header } from "@/components/layout/Header"
import { StyleProfileView } from "@/components/profile/StyleProfileView"

export const metadata = {
  title: "Your Style Profile — Fitted",
  description: "Your personalized style profile summary.",
}

export default async function ProfilePage({
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

  if (!profile) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        <StyleProfileView
          assessmentId={assessmentId}
          firstName={assessment.firstName || "there"}
          profile={{
            headline: profile.summaryHeadline || "",
            body: profile.summaryBody || "",
            archetype: profile.styleArchetype || "",
            keyTraits: (profile.keyTraits as string[]) || [],
            colorPalette: (profile.colorPalette as string[]) || [],
            brandPreview: (profile.brandRecommendationPreview as string[]) || [],
          }}
        />
      </main>
    </>
  )
}