import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { AssessmentFlow } from "@/components/assessment/AssessmentFlow"
import { db } from "@/lib/db"
import { styleAssessments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function AssessmentPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/assessment")
  }

  const userId = session.user.id

  const existingAssessments = await db
    .select()
    .from(styleAssessments)
    .where(eq(styleAssessments.userId, userId))
    .limit(1)

  const existing = existingAssessments[0]

  const existingData = existing
    ? {
        waistSize: existing.waistSize ?? undefined,
        chestSize: existing.chestSize ?? undefined,
        inseam: existing.inseam ?? undefined,
        typicalShirtSize: existing.typicalShirtSize ?? undefined,
        typicalPantSize: existing.typicalPantSize ?? undefined,
        shoeSize: existing.shoeSize ?? undefined,
        height: existing.height ?? undefined,
        bodyType: existing.bodyType ?? undefined,
        fitPreference: existing.fitPreference ?? undefined,
        brandFitReferences: existing.brandFitReferences ?? undefined,
        brandsLiked: existing.brandsLiked ?? undefined,
        lifestyleContext: existing.lifestyleContext ?? undefined,
        lifestyleFrequency: existing.lifestyleFrequency ?? undefined,
        styleGoals: existing.styleGoals ?? undefined,
        styleReferences: existing.styleReferences ?? undefined,
        colorPreferences: existing.colorPreferences ?? undefined,
        wardrobeGaps: existing.wardrobeGaps ?? undefined,
        budgetRange: existing.budgetRange ?? undefined,
        shoppingBehavior: existing.shoppingBehavior ?? undefined,
      }
    : undefined

  return (
    <>
      <Header />
      <main className="min-h-[80vh] px-4 sm:px-6 py-12">
        <AssessmentFlow
          userId={userId}
          existingData={existingData}
          assessmentId={existing?.id}
        />
      </main>
      <Footer />
    </>
  )
}