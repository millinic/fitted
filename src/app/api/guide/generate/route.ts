import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { styleAssessments, styleGuides, payments } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { StyleGuideContent } from "@/lib/db/schema"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { assessmentId, sessionId } = await request.json()

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID required" }, { status: 400 })
    }

    // Verify payment exists and update if pending
    if (sessionId) {
      const paymentRecords = await db
        .select()
        .from(payments)
        .where(
          and(
            eq(payments.stripeSessionId, sessionId),
            eq(payments.userId, session.user.id)
          )
        )
        .limit(1)

      if (paymentRecords[0] && paymentRecords[0].status === "pending") {
        await db
          .update(payments)
          .set({ status: "completed", updatedAt: new Date() })
          .where(eq(payments.id, paymentRecords[0].id))
      }
    }

    // Check for existing guide with content
    const existingGuides = await db
      .select()
      .from(styleGuides)
      .where(
        and(
          eq(styleGuides.assessmentId, assessmentId),
          eq(styleGuides.userId, session.user.id)
        )
      )
      .limit(1)

    if (existingGuides[0] && existingGuides[0].guideContent) {
      return NextResponse.json({ success: true })
    }

    // Get assessment
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

    // Get or create payment record
    let paymentId: string
    const paymentRecords = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, session.user.id))
      .limit(1)

    if (paymentRecords[0]) {
      paymentId = paymentRecords[0].id
    } else {
      const newPayment = await db
        .insert(payments)
        .values({
          userId: session.user.id,
          amount: 9800,
          currency: "usd",
          status: "completed",
          stripeSessionId: sessionId || null,
        })
        .returning({ id: payments.id })
      paymentId = newPayment[0].id
    }

    // Update or create guide record
    let guideId: string
    if (existingGuides[0]) {
      guideId = existingGuides[0].id
      await db
        .update(styleGuides)
        .set({ status: "generating", updatedAt: new Date() })
        .where(eq(styleGuides.id, guideId))
    } else {
      const newGuide = await db
        .insert(styleGuides)
        .values({
          userId: session.user.id,
          assessmentId,
          paymentId,
          status: "generating",
        })
        .returning({ id: styleGuides.id })
      guideId = newGuide[0].id
    }

    // Build budget context
    const budgetDescriptions: Record<string, string> = {
      moderate: "$50–$150 per item",
      upper_moderate: "$100–$250 per item",
      premium: "$200–$500 per item",
      luxury: "$500+ per item",
    }
    const budgetDesc = assessment.budgetRange
      ? budgetDescriptions[assessment.budgetRange] || assessment.budgetRange
      : "Not specified"

    // Generate guide content
    const prompt = `You are an expert men's style consultant with an elevated, timeless aesthetic sensibility. Your taste is refined and confident — referencing brands like Ralph Lauren, COS, A.P.C., Ami Paris, Reiss, and Todd Snyder. You create wardrobes that are well-constructed, versatile, and appropriate without being boring.

You are generating a comprehensive, personalized style guide for a specific client. Every recommendation must be:
1. A real, currently available product (use accurate brand names and realistic product names)
2. Within the client's stated budget range
3. Appropriate for their body type and fit preference
4. Aligned with their stated lifestyle contexts and style goals
5. Complementary to brands they already like

Client Assessment:
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
- Budget range: ${budgetDesc}
- Shopping behavior: ${assessment.shoppingBehavior || "Not specified"}

IMPORTANT: Focus recommendations on the client's wardrobe gaps. If they specified gaps in outerwear, trousers, footwear, etc., prioritize those categories. Include at least 5 sections and 2-3 items per section.

Respond with valid JSON only, matching this exact structure:
{
  "introduction": "A personalized 2-3 sentence introduction addressing the client directly, referencing their specific goals and lifestyle",
  "sections": [
    {
      "category": "Category name (e.g., 'Outerwear', 'Trousers', 'Shirts', 'Knitwear', 'T-Shirts & Basics', 'Footwear', 'Accessories', 'Denim')",
      "items": [
        {
          "name": "Specific product name (realistic and currently available)",
          "brand": "Brand name",
          "description": "2-3 sentence description of the item, material, and why it works for this client",
          "reasoning": "One concise sentence explaining why this specific item was chosen for this client",
          "purchaseUrl": "https://www.brandname.com/product-category",
          "imageUrl": "",
          "priceRange": "$XX–$XXX"
        }
      ]
    }
  ],
  "lookbooks": [
    {
      "title": "Outfit name (e.g., 'Elevated Weekend', 'Smart Casual Friday', 'Date Night')",
      "description": "Detailed description of how to put the outfit together, including which specific items from the recommendations to combine and when to wear it",
      "imageUrl": "",
      "itemIds": []
    }
  ]
}

Generate at least 5-6 sections with 2-3 items each (15+ total items), and at least 4 lookbook entries. Every recommendation must feel specific to this client — not a generic capsule wardrobe. Use real brand URLs (e.g., https://www.cos.com, https://www.ralphlauren.com, https://www.reiss.com).`

    const result = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 5000,
    })

    let guideContent: StyleGuideContent
    try {
      const cleaned = result.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      guideContent = JSON.parse(cleaned)
    } catch {
      await db
        .update(styleGuides)
        .set({ status: "pending_generation", updatedAt: new Date() })
        .where(eq(styleGuides.id, guideId))
      return NextResponse.json({ error: "Failed to parse guide content" }, { status: 500 })
    }

    await db
      .update(styleGuides)
      .set({
        guideContent,
        status: "pending_review",
        updatedAt: new Date(),
      })
      .where(eq(styleGuides.id, guideId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Guide generation error:", error)
    return NextResponse.json({ error: "Failed to generate guide" }, { status: 500 })
  }
}