import { generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"
import type { AssessmentFormData, StyleProfileSummaryContent, StyleGuideContent } from "@/types"

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set")
  }
  return createOpenAI({ apiKey })
}

const styleProfileSchema = z.object({
  styleArchetype: z.string(),
  aestheticDescription: z.string(),
  keyPrinciples: z.array(z.string()),
  recommendedBrands: z.array(z.string()),
  colorPalette: z.array(z.string()),
  fitGuidance: z.string(),
})

const styleGuideSchema = z.object({
  sections: z.array(
    z.object({
      category: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          brand: z.string(),
          description: z.string(),
          reasoning: z.string(),
          purchaseUrl: z.string(),
          affiliateUrl: z.string().optional(),
          imageUrl: z.string().optional(),
          priceRange: z.string(),
        })
      ),
    })
  ),
  lookbooks: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      items: z.array(z.string()),
      imageUrl: z.string().optional(),
    })
  ),
  generalTips: z.array(z.string()),
})

export async function generateStyleProfileSummary(
  assessment: AssessmentFormData
): Promise<StyleProfileSummaryContent> {
  const openai = getOpenAI()

  const systemPrompt = `You are an expert men's style consultant with a refined, elevated aesthetic sensibility. Your style philosophy is rooted in timelessness, quality, and effortless sophistication — think Ralph Lauren, COS, ARKET, and MANGO Man. You believe in dressing well as a form of self-respect, not vanity.

You are creating a style profile summary for a client based on their assessment answers. This summary should feel genuinely personalized — not generic. Reference their specific answers. Be specific about their archetype, the aesthetic direction you'd take them in, and why.

Be confident and direct. Use language that is elevated but never pretentious. Think of how a trusted, stylish friend who happens to be an expert would speak.`

  const userPrompt = `Here is the client's style assessment:

Height: ${assessment.height}
Body Type: ${assessment.bodyType}
Fit Preference: ${assessment.fitPreference}
Waist: ${assessment.waistSize}, Chest: ${assessment.chestSize}, Inseam: ${assessment.inseam}
Typical Shirt Size: ${assessment.typicalShirtSize}, Pant Size: ${assessment.typicalPantSize}, Shoe Size: ${assessment.shoeSize}

Brands that fit well: ${assessment.brandFitReferences.join(", ") || "Not specified"}
Brands they like: ${assessment.brandsLiked.join(", ") || "Not specified"}
Style references: ${assessment.styleReferences.join(", ") || "Not specified"}

Lifestyle contexts: ${assessment.lifestyleContext.join(", ") || "Not specified"}
Style goals: ${assessment.styleGoals.join(", ") || "Not specified"}

Color preferences: ${assessment.colorPreferences.join(", ") || "Not specified"}
Colors to avoid: ${assessment.colorsToAvoid.join(", ") || "Not specified"}

Wardrobe gaps: ${assessment.wardrobeGaps.join(", ") || "Not specified"}
Budget range: ${assessment.budgetRange}
Shopping behavior: ${assessment.shoppingBehavior || "Not specified"}

Additional notes: ${assessment.additionalNotes || "None"}

Generate a personalized style profile summary that will make this client feel understood and excited about their style direction. The styleArchetype should be a compelling 2-4 word descriptor (e.g., "Modern Minimalist", "Elevated Essential", "Refined Creative"). The aestheticDescription should be 2-3 sentences painting a picture of their ideal aesthetic direction. keyPrinciples should be 3-4 specific, actionable style principles tailored to them. recommendedBrands should be 5-8 brands from various price points that match their aesthetic, budget, and fit. colorPalette should be 5-7 specific colors that form their ideal palette. fitGuidance should be 2-3 sentences of specific fit advice based on their body type and preferences.`

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: styleProfileSchema,
    system: systemPrompt,
    prompt: userPrompt,
  })

  return object
}

export async function generateFullStyleGuide(
  assessment: AssessmentFormData,
  profileSummary: StyleProfileSummaryContent
): Promise<StyleGuideContent> {
  const openai = getOpenAI()

  const systemPrompt = `You are an expert men's style consultant creating a comprehensive, personalized style guide. Your aesthetic sensibility is elevated, timeless, and effortlessly sophisticated. Reference brands for your tone: Ralph Lauren, COS, ARKET, MANGO Man, A.P.C.

You are generating specific product recommendations with real brands and realistic product names. Each recommendation should feel hand-picked for this specific client.

Rules:
1. Every recommendation must include a reasoning — one concise sentence explaining WHY this piece works for them specifically
2. Product names should be realistic and specific (e.g., "Slim Fit Oxford Shirt in White" not just "White Shirt")
3. Purchase URLs should point to real brand websites (e.g., https://www.cos.com, https://www.ralphlauren.com)
4. Price ranges should match their budget range and the brand tier
5. Include 6-8 product categories covering their wardrobe gaps and lifestyle needs
6. Each category should have 2-3 specific product recommendations
7. Create 3-4 lookbooks showing how pieces work together
8. Include 5-7 general style tips personalized to their goals and lifestyle
9. Recommendations should prioritize trends ONLY when they align with the client's stated preferences and overall quality standards — default to timelessness`

  const userPrompt = `Client Style Profile:
Archetype: ${profileSummary.styleArchetype}
Aesthetic: ${profileSummary.aestheticDescription}
Key Principles: ${profileSummary.keyPrinciples.join("; ")}
Recommended Brands: ${profileSummary.recommendedBrands.join(", ")}
Color Palette: ${profileSummary.colorPalette.join(", ")}
Fit Guidance: ${profileSummary.fitGuidance}

Client Assessment Data:
Height: ${assessment.height}
Body Type: ${assessment.bodyType}
Fit Preference: ${assessment.fitPreference}
Measurements - Waist: ${assessment.waistSize}, Chest: ${assessment.chestSize}, Inseam: ${assessment.inseam}
Sizes - Shirt: ${assessment.typicalShirtSize}, Pants: ${assessment.typicalPantSize}, Shoes: ${assessment.shoeSize}

Brands they already like: ${assessment.brandsLiked.join(", ") || "Not specified"}
Style references: ${assessment.styleReferences.join(", ") || "Not specified"}
Lifestyle: ${assessment.lifestyleContext.join(", ") || "Not specified"}
Style goals: ${assessment.styleGoals.join(", ") || "Not specified"}
Color preferences: ${assessment.colorPreferences.join(", ") || "Not specified"}
Colors to avoid: ${assessment.colorsToAvoid.join(", ") || "Not specified"}
Wardrobe gaps: ${assessment.wardrobeGaps.join(", ") || "Not specified"}
Budget: ${assessment.budgetRange}
Shopping behavior: ${assessment.shoppingBehavior || "Not specified"}

Generate a comprehensive, highly personalized style guide with specific product recommendations, lookbook combinations, and general tips. Every recommendation should feel intentional and specifically chosen for this client.`

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: styleGuideSchema,
    system: systemPrompt,
    prompt: userPrompt,
  })

  return object
}