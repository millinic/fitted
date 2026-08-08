import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { styleAssessments, styleProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { StyleProfileSummary } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { assessmentId } = await request.json()

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID required" }, { status: 400 })
    }

    const assessments = await db
      .select()
      .from(styleAssessments)
      .where(eq(styleAssessments.id, assessmentId))
      .limit(1)

    const assessment = assessments[0]
    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    if (assessment.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check for existing profile
    const existingProfiles = await db
      .select()
      .from(styleProfiles)
      .where(eq(styleProfiles.assessmentId, assessmentId))
      .limit(1)

    if (existingProfiles[0]) {
      return NextResponse.json({
        success: true,
        data: { profileId: existingProfiles[0].id, summary: existingProfiles[0].summaryContent },
      })
    }

    const prompt = `You are an expert men's style consultant with a refined, elevated aesthetic sensibility. Your taste references brands like Ralph Lauren, COS, A.P.C., Ami Paris, and Todd Snyder — timeless, well-constructed, confident without being flashy.

Based on the following style assessment data, generate a personalized style profile summary. Be specific, insightful, and make the user feel understood. Avoid generic platitudes — reference their actual answers.

Assessment Data:
- Height: ${assessment.height || "Not provided"}
- Body Type: ${assessment.bodyType || "Not provided"}
- Fit Preference: ${assessment.fitPreference || "Not provided"}
- Waist: ${assessment.waistSize || "N/A"}, Chest: ${assessment.chestSize || "N/A"}, Inseam: ${assessment.inseam || "N/A"}
- Shirt Size: ${assessment.typicalShirtSize || "N/A"}, Pant Size: ${assessment.typicalPantSize || "N/A"}
- Shoe Size: ${assessment.shoeSize || "N/A"}
- Brands they like: ${assessment.brandsLiked?.join(", ") || "None specified"}
- Brands that fit well: ${assessment.brandFitReferences?.join(", ") || "None specified"}
- Lifestyle contexts: ${assessment.lifestyleContext?.join(", ") || "Not specified"}
- Style goals: ${assessment.styleGoals?.join(", ") || "Not specified"}
- Style references: ${assessment.styleReferences?.join(", ") || "None specified"}
- Color preferences: ${assessment.colorPreferences?.join(", ") || "Not specified"}
- Wardrobe gaps: ${assessment.wardrobeGaps?.join(", ") || "Not specified"}
- Budget range: ${assessment.budgetRange || "Not specified"}
- Shopping behavior: ${assessment.shoppingBehavior || "Not specified"}

Respond with valid JSON only, matching this exact structure:
{
  "headline": "A compelling one-line description of their style identity (max 15 words)",
  "styleArchetype": "A 2-3 word archetype name (e.g., 'Modern Minimalist', 'Refined Casual', 'Urban Classic')",
  "keyInsights": ["3-4 specific, personal insights about their style based on their answers — not generic advice"],
  "fitSummary": "A concise paragraph about ideal fit and silhouette for their body type and preferences",
  "colorPalette": ["6-8 specific colors that would work well for them based on their preferences"],
  "brandAffinities": ["5-7 brand recommendations that align with their aesthetic and budget"]
}`

    const result = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
    })

    let summaryContent: StyleProfileSummary
    try {
      const cleaned = result.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      summaryContent = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    const inserted = await db
      .insert(styleProfiles)
      .values({
        userId: session.user.id,
        assessmentId,
        summaryContent,
      })
      .returning({ id: styleProfiles.id })

    return NextResponse.json({
      success: true,
      data: { profileId: inserted[0].id, summary: summaryContent },
    })
  } catch (error) {
    console.error("Profile generation error:", error)
    return NextResponse.json({ error: "Failed to generate profile" }, { status: 500 })
  }
}