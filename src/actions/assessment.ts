"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { styleAssessments, styleProfileSummaries } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { generateStyleProfileSummary } from "@/lib/ai"
import type { AssessmentFormData, StyleProfileSummaryContent } from "@/types"

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function saveAssessment(
  formData: AssessmentFormData
): Promise<ActionResult<{ assessmentId: string; profileSummary: StyleProfileSummaryContent }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to save your assessment." }
    }

    const userId = session.user.id

    // Check for existing assessment
    const existing = await db
      .select()
      .from(styleAssessments)
      .where(eq(styleAssessments.userId, userId))
      .limit(1)

    let assessmentId: string

    const assessmentValues = {
      waistSize: formData.waistSize || null,
      chestSize: formData.chestSize || null,
      inseam: formData.inseam || null,
      typicalShirtSize: formData.typicalShirtSize || null,
      typicalPantSize: formData.typicalPantSize || null,
      shoeSize: formData.shoeSize || null,
      height: formData.height || null,
      bodyType: formData.bodyType || null,
      fitPreference: formData.fitPreference || null,
      brandFitReferences: formData.brandFitReferences,
      lifestyleContext: formData.lifestyleContext,
      lifestyleFrequency: formData.lifestyleFrequency,
      styleGoals: formData.styleGoals,
      brandsLiked: formData.brandsLiked,
      styleReferences: formData.styleReferences,
      colorPreferences: formData.colorPreferences,
      colorsToAvoid: formData.colorsToAvoid,
      wardrobeGaps: formData.wardrobeGaps,
      budgetRange: formData.budgetRange || null,
      shoppingBehavior: formData.shoppingBehavior || null,
      additionalNotes: formData.additionalNotes || null,
      completedAt: new Date(),
      updatedAt: new Date(),
    }

    if (existing.length > 0) {
      const updated = await db
        .update(styleAssessments)
        .set(assessmentValues)
        .where(eq(styleAssessments.userId, userId))
        .returning({ id: styleAssessments.id })

      assessmentId = updated[0].id
    } else {
      const inserted = await db
        .insert(styleAssessments)
        .values({
          userId,
          ...assessmentValues,
        })
        .returning({ id: styleAssessments.id })

      assessmentId = inserted[0].id
    }

    // Generate style profile summary via AI
    const summaryContent = await generateStyleProfileSummary(formData)

    // Delete any existing summaries for this assessment, then insert new one
    await db
      .delete(styleProfileSummaries)
      .where(eq(styleProfileSummaries.assessmentId, assessmentId))

    await db.insert(styleProfileSummaries).values({
      userId,
      assessmentId,
      summaryContent,
      generatedAt: new Date(),
    })

    return {
      success: true,
      data: { assessmentId, profileSummary: summaryContent },
    }
  } catch (error) {
    console.error("Failed to save assessment:", error)
    return { success: false, error: "Failed to save assessment. Please try again." }
  }
}

export async function getAssessment(): Promise<ActionResult<{
  assessment: AssessmentFormData
  assessmentId: string
} | null>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const result = await db
      .select()
      .from(styleAssessments)
      .where(eq(styleAssessments.userId, session.user.id))
      .limit(1)

    if (result.length === 0) {
      return { success: true, data: null }
    }

    const a = result[0]
    return {
      success: true,
      data: {
        assessmentId: a.id,
        assessment: {
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
        },
      },
    }
  } catch (error) {
    console.error("Failed to get assessment:", error)
    return { success: false, error: "Failed to load assessment." }
  }
}