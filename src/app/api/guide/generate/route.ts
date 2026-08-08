import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { assessments, styleProfiles, styleGuides } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { generateFullStyleGuide } from "@/lib/ai"
import type { AssessmentFormData, ApiResponse } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const { assessmentId } = await request.json()

    if (!assessmentId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Assessment ID is required" },
        { status: 400 }
      )
    }

    const db = getDb()

    // Check if guide already exists
    const existingGuide = await db.query.styleGuides.findFirst({
      where: eq(styleGuides.assessmentId, assessmentId),
    })

    if (existingGuide) {
      return NextResponse.json<ApiResponse<{ guideId: string }>>({
        success: true,
        data: { guideId: existingGuide.id },
        message: "Guide already exists",
      })
    }

    const assessment = await db.query.assessments.findFirst({
      where: eq(assessments.id, assessmentId),
    })

    if (!assessment) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Assessment not found" },
        { status: 404 }
      )
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

    try {
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

      return NextResponse.json<ApiResponse<{ guideId: string }>>({
        success: true,
        data: { guideId: guide.id },
      })
    } catch (genError: any) {
      console.error("Guide generation error:", genError)
      await db
        .update(styleGuides)
        .set({
          status: "revision_requested",
          founderNotes: `Auto-generation failed: ${genError.message}`,
          updatedAt: new Date(),
        })
        .where(eq(styleGuides.id, guide.id))

      return NextResponse.json<ApiResponse<{ guideId: string }>>({
        success: true,
        data: { guideId: guide.id },
        message: "Guide created but generation failed. It will be manually reviewed.",
      })
    }
  } catch (error: any) {
    console.error("Guide generation error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || "Failed to generate guide" },
      { status: 500 }
    )
  }
}