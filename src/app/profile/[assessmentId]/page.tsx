import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { styleAssessments, styleProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ProfileView } from "@/components/profile/ProfileView"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ assessmentId: string }>
}) {
  const { assessmentId } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/assessment")
  }

  const assessments = await db
    .select()
    .from(styleAssessments)
    .where(eq(styleAssessments.id, assessmentId))
    .limit(1)

  const assessment = assessments[0]

  if (!assessment || assessment.userId !== session.user.id) {
    redirect("/assessment")
  }

  const existingProfiles = await db
    .select()
    .from(styleProfiles)
    .where(eq(styleProfiles.assessmentId, assessmentId))
    .limit(1)

  const existingProfile = existingProfiles[0]

  return (
    <>
      <Header />
      <main className="min-h-[80vh]">
        <ProfileView
          assessmentId={assessmentId}
          userId={session.user.id}
          existingProfile={
            existingProfile
              ? {
                  id: existingProfile.id,
                  summary: existingProfile.summaryContent,
                }
              : undefined
          }
        />
      </main>
      <Footer />
    </>
  )
}