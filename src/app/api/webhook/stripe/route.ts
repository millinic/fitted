import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { getDb } from "@/lib/db"
import { payments, assessments, styleProfiles, styleGuides } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { generateFullStyleGuide } from "@/lib/ai"
import type { AssessmentFormData } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })
    }

    const stripe = getStripe()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured")
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any
      const assessmentId = session.metadata?.assessmentId

      if (!assessmentId) {
        console.error("No assessmentId in session metadata")
        return NextResponse.json({ received: true })
      }

      const db = getDb()

      // Record payment
      await db.insert(payments).values({
        assessmentId,
        stripePaymentIntentId: session.payment_intent,
        stripeCustomerId: session.customer,
        amount: session.amount_total,
        currency: session.currency,
        status: "succeeded",
        receiptEmail: session.customer_details?.email,
      })

      // Check if guide already exists (may have been triggered by the generating page)
      const existingGuide = await db.query.styleGuides.findFirst({
        where: eq(styleGuides.assessmentId, assessmentId),
      })

      if (existingGuide) {
        // Guide already being generated, skip
        return NextResponse.json({ received: true })
      }

      const assessment = await db.query.assessments.findFirst({
        where: eq(assessments.id, assessmentId),
      })

      if (!assessment) {
        console.error("Assessment not found:", assessmentId)
        return NextResponse.json({ received: true })
      }

      const profile = await db.query.styleProfiles.findFirst({
        where: eq(styleProfiles.assessmentId, assessmentId),
      })

      const [guide] = await db
        .insert(styleGuides)
        .values({
          assessmentId,
          styleProfileId: profile?.id,
          status: "generating",
        })
        .returning()

      try {
        const assessmentData: AssessmentFormData = {
          firstName: assessment.firstName || "",
          lastName: assessment.lastName || "",
          age: assessment.age,
          location: assessment.location || "",
          heightFeet: assessment.heightFeet,
          heightInches: assessment.heightInches,
          waist: assessment.waist,
          chest: assessment.chest,
          inseam: assessment.inseam,
          shoeSize: assessment.shoeSize || "",
          typicalTopSize: assessment.typicalTopSize || "",
          typicalBottomSize: assessment.typicalBottomSize || "",
          bodyType: assessment.bodyType,
          fitPreference: assessment.fitPreference,
          brandFitReferences: (assessment.brandFitReferences as string[]) || [],
          lifestyleContext: (assessment.lifestyleContext as string[]) || [],
          lifestyleFrequency: (assessment.lifestyleFrequency as Record<string, string>) || {},
          styleGoal: assessment.styleGoal || "",
          brandsLiked: (assessment.brandsLiked as string[]) || [],
          styleReferences: (assessment.styleReferences as string[]) || [],
          colorPreferences: (assessment.colorPreferences as string[]) || [],
          colorsToAvoid: (assessment.colorsToAvoid as string[]) || [],
          wardrobeGaps: (assessment.wardrobeGaps as string[]) || [],
          budgetRange: assessment.budgetRange,
          monthlyBudget: assessment.monthlyBudget,
          shoppingBehavior: assessment.shoppingBehavior || "",
          additionalNotes: assessment.additionalNotes || "",
        }

        const profileSummary = {
          headline: profile?.summaryHeadline || "",
          body: profile?.summaryBody || "",
          archetype: profile?.styleArchetype || "",
          keyTraits: (profile?.keyTraits as string[]) || [],
          colorPalette: (profile?.colorPalette as string[]) || [],
          brandPreview: (profile?.brandRecommendationPreview as string[]) || [],
        }

        const guideContent = await generateFullStyleGuide(assessmentData, profileSummary)

        await db
          .update(styleGuides)
          .set({
            introduction: guideContent.introduction,
            recommendations: guideContent.recommendations,
            lookbooks: guideContent.lookbooks,
            generalAdvice: guideContent.generalAdvice,
            rawAiResponse: guideContent as any,
            status: "pending_review",
            updatedAt: new Date(),
          })
          .where(eq(styleGuides.id, guide.id))
      } catch (genError) {
        console.error("Guide generation error:", genError)
        await db
          .update(styleGuides)
          .set({
            status: "revision_requested",
            founderNotes: "Auto-generation failed. Manual review required.",
            updatedAt: new Date(),
          })
          .where(eq(styleGuides.id, guide.id))
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}