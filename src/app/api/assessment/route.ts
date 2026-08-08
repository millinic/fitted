import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { assessments, styleProfiles } from "@/lib/db/schema"
import { generateStyleProfile } from "@/lib/ai"
import type { AssessmentFormData, ApiResponse } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body: AssessmentFormData = await request.json()

    if (!body.firstName || body.firstName.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "First name is required" },
        { status: 400 }
      )
    }

    const db = getDb()

    const [assessment] = await db
      .insert(assessments)
      .values({
        firstName: body.firstName.trim(),
        lastName: body.lastName?.trim() || null,
        age: body.age,
        location: body.location?.trim() || null,
        heightFeet: body.heightFeet,
        heightInches: body.heightInches,
        waist: body.waist,
        chest: body.chest,
        inseam: body.inseam,
        shoeSize: body.shoeSize || null,
        typicalTopSize: body.typicalTopSize || null,
        typicalBottomSize: body.typicalBottomSize || null,
        bodyType: body.bodyType,
        fitPreference: body.fitPreference,
        brandFitReferences: body.brandFitReferences.length > 0 ? body.brandFitReferences : null,
        lifestyleContext: body.lifestyleContext.length > 0 ? body.lifestyleContext : null,
        lifestyleFrequency: Object.keys(body.lifestyleFrequency).length > 0 ? body.lifestyleFrequency : null,
        styleGoal: body.styleGoal || null,
        brandsLiked: body.brandsLiked.length > 0 ? body.brandsLiked : null,
        styleReferences: body.styleReferences.length > 0 ? body.styleReferences : null,
        colorPreferences: body.colorPreferences.length > 0 ? body.colorPreferences : null,
        colorsToAvoid: body.colorsToAvoid.length > 0 ? body.colorsToAvoid : null,
        wardrobeGaps: body.wardrobeGaps.length > 0 ? body.wardrobeGaps : null,
        budgetRange: body.budgetRange,
        monthlyBudget: body.monthlyBudget,
        shoppingBehavior: body.shoppingBehavior || null,
        additionalNotes: body.additionalNotes?.trim() || null,
        completedAt: new Date(),
      })
      .returning()

    let profileSummary
    try {
      profileSummary = await generateStyleProfile(body)
    } catch (aiError: any) {
      console.error("AI generation error:", aiError)
      profileSummary = {
        headline: `${body.firstName}'s Style Profile`,
        body: `Based on your preferences for ${body.fitPreference || "comfortable"} fits, ${body.budgetRange || "thoughtful"} spending, and your interest in brands like ${body.brandsLiked?.slice(0, 3).join(", ") || "quality labels"}, we've identified a clear style direction for you. Your guide will include specific recommendations tailored to your ${body.bodyType || ""} build and ${body.lifestyleContext?.join(", ") || "everyday"} lifestyle.`,
        archetype: "Modern Essential",
        keyTraits: ["Quality-focused", "Versatile", "Confident", "Intentional"],
        colorPalette: body.colorPreferences?.slice(0, 5) || ["Navy", "White", "Grey", "Black", "Tan"],
        brandPreview: body.brandsLiked?.slice(0, 4) || ["COS", "APC", "Reiss", "Norse Projects"],
      }
    }

    await db.insert(styleProfiles).values({
      assessmentId: assessment.id,
      summaryHeadline: profileSummary.headline,
      summaryBody: profileSummary.body,
      styleArchetype: profileSummary.archetype,
      keyTraits: profileSummary.keyTraits,
      colorPalette: profileSummary.colorPalette,
      brandRecommendationPreview: profileSummary.brandPreview,
      rawAiResponse: profileSummary as any,
    })

    return NextResponse.json<ApiResponse<{ assessmentId: string }>>({
      success: true,
      data: { assessmentId: assessment.id },
    })
  } catch (error: any) {
    console.error("Assessment submission error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}