"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { payments, styleAssessments, styleGuides, styleProfileSummaries } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getStripe } from "@/lib/stripe"
import { GUIDE_PRICE_CENTS, CURRENCY, APP_NAME } from "@/lib/constants"
import { generateFullStyleGuide } from "@/lib/ai"
import type { ActionResult } from "./assessment"
import type { AssessmentFormData, StyleProfileSummaryContent } from "@/types"

export async function createCheckoutSession(
  assessmentId: string
): Promise<ActionResult<{ sessionUrl: string }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const stripe = getStripe()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Verify assessment exists and belongs to user
    const assessment = await db
      .select()
      .from(styleAssessments)
      .where(
        and(
          eq(styleAssessments.id, assessmentId),
          eq(styleAssessments.userId, session.user.id)
        )
      )
      .limit(1)

    if (assessment.length === 0) {
      return { success: false, error: "Assessment not found" }
    }

    // Check if already paid
    const existingPayment = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.assessmentId, assessmentId),
          eq(payments.status, "completed")
        )
      )
      .limit(1)

    if (existingPayment.length > 0) {
      return { success: false, error: "You have already purchased a guide for this assessment." }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: `${APP_NAME} — Personalized Style Guide`,
              description:
                "Your comprehensive, expert-curated wardrobe guide with specific product recommendations.",
            },
            unit_amount: GUIDE_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/guide/generating?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/profile?assessmentId=${assessmentId}`,
      metadata: {
        userId: session.user.id,
        assessmentId,
      },
      customer_email: session.user.email || undefined,
    })

    if (!checkoutSession.url) {
      return { success: false, error: "Failed to create checkout session" }
    }

    // Create pending payment record
    await db.insert(payments).values({
      userId: session.user.id,
      assessmentId,
      stripeSessionId: checkoutSession.id,
      amount: GUIDE_PRICE_CENTS,
      currency: CURRENCY,
      status: "pending",
    })

    return { success: true, data: { sessionUrl: checkoutSession.url } }
  } catch (error) {
    console.error("Failed to create checkout session:", error)
    return { success: false, error: "Failed to initiate payment. Please try again." }
  }
}

export async function verifyPaymentAndGenerateGuide(
  stripeSessionId: string
): Promise<ActionResult<{ guideId: string }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const stripe = getStripe()
    const checkoutSession = await stripe.checkout.sessions.retrieve(stripeSessionId)

    if (checkoutSession.payment_status !== "paid") {
      return { success: false, error: "Payment not completed" }
    }

    const assessmentId = checkoutSession.metadata?.assessmentId
    const userId = checkoutSession.metadata?.userId

    if (!assessmentId || userId !== session.user.id) {
      return { success: false, error: "Invalid session" }
    }

    // Update payment record
    await db
      .update(payments)
      .set({
        status: "completed",
        stripePaymentIntentId: checkoutSession.payment_intent as string,
        updatedAt: new Date(),
      })
      .where(eq(payments.stripeSessionId, stripeSessionId))

    // Check if guide already exists for this assessment
    const existingGuide = await db
      .select()
      .from(styleGuides)
      .where(eq(styleGuides.assessmentId, assessmentId))
      .limit(1)

    if (existingGuide.length > 0) {
      return { success: true, data: { guideId: existingGuide[0].id } }
    }

    // Get payment record
    const paymentRecord = await db
      .select()
      .from(payments)
      .where(eq(payments.stripeSessionId, stripeSessionId))
      .limit(1)

    if (paymentRecord.length === 0) {
      return { success: false, error: "Payment record not found" }
    }

    // Get assessment data
    const assessment = await db
      .select()
      .from(styleAssessments)
      .where(eq(styleAssessments.id, assessmentId))
      .limit(1)

    if (assessment.length === 0) {
      return { success: false, error: "Assessment not found" }
    }

    // Get profile summary
    const summaryResult = await db
      .select()
      .from(styleProfileSummaries)
      .where(eq(styleProfileSummaries.assessmentId, assessmentId))
      .limit(1)

    if (summaryResult.length === 0) {
      return { success: false, error: "Profile summary not found" }
    }

    const a = assessment[0]
    const assessmentData: AssessmentFormData = {
      waistSize: a.waistSize || "",
      chestSize: a.chestSize || "",
      inseam: a.inseam || "",
      typicalShirtSize: a.typicalShirtSize || "",
      typicalPantSize: a.typicalPantSize || "",
      shoeSize: a.shoeSize || "",
      height: a.height || "",
      bodyType: (a.bodyType as AssessmentFormData["bodyType"]) || "",
      fitPreference: (a.fitPreference as AssessmentFormData["fitPreference"]) || "",
      brandFitReferences: (a.brandFitReferences as string[]) || [],
      lifestyleContext: (a.lifestyleContext as string[]) || [],
      lifestyleFrequency: (a.lifestyleFrequency as Record<string, string>) || {},
      styleGoals: (a.styleGoals as string[]) || [],
      brandsLiked: (a.brandsLiked as string[]) || [],
      styleReferences: (a.styleReferences as string[]) || [],
      colorPreferences: (a.colorPreferences as string[]) || [],
      colorsToAvoid: (a.colorsToAvoid as string[]) || [],
      wardrobeGaps: (a.wardrobeGaps as string[]) || [],
      budgetRange: (a.budgetRange as AssessmentFormData["budgetRange"]) || "",
      shoppingBehavior: a.shoppingBehavior || "",
      additionalNotes: a.additionalNotes || "",
    }

    const profileSummary = summaryResult[0].summaryContent as StyleProfileSummaryContent

    // Create guide record in generating state
    const guideInsert = await db
      .insert(styleGuides)
      .values({
        userId: session.user.id,
        assessmentId,
        paymentId: paymentRecord[0].id,
        status: "generating",
      })
      .returning({ id: styleGuides.id })

    const guideId = guideInsert[0].id

    // Generate guide content via AI
    try {
      const guideContent = await generateFullStyleGuide(assessmentData, profileSummary)

      await db
        .update(styleGuides)
        .set({
          guideContent,
          status: "pending_review",
          updatedAt: new Date(),
        })
        .where(eq(styleGuides.id, guideId))
    } catch (genError) {
      console.error("Guide generation failed:", genError)
      await db
        .update(styleGuides)
        .set({
          status: "generating",
          founderNotes: "Auto-generation failed. Manual review needed.",
          updatedAt: new Date(),
        })
        .where(eq(styleGuides.id, guideId))
    }

    return { success: true, data: { guideId } }
  } catch (error) {
    console.error("Failed to verify payment:", error)
    return { success: false, error: "Failed to verify payment. Please contact support." }
  }
}