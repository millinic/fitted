import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { AssessmentFormData, StyleProfileSummary, StyleGuideContent } from "@/types"
import type { GuideRecommendation, GuideLookbook } from "@/lib/db/schema"

function getModel() {
  return openai("gpt-4o")
}

const FOUNDER_PHILOSOPHY = `You are an expert men's style consultant with a refined, elevated aesthetic sensibility. Your style philosophy:

1. TIMELESSNESS OVER TRENDS: Recommend pieces that will look good for years, not months. Trends may inform recommendations only when they align with the user's preferences and overall quality standards.

2. FIT IS EVERYTHING: The most expensive piece looks terrible if it doesn't fit. Prioritize proper fit above all else.

3. QUALITY OVER QUANTITY: Fewer, better pieces. A curated wardrobe of 30 excellent items beats 100 mediocre ones.

4. ELEVATED BASICS: The foundation of great style is exceptional basics — perfect t-shirts, well-cut trousers, quality knitwear.

5. INTENTIONAL COLOR: Build around a cohesive color palette. Neutrals form the foundation; accent colors add personality.

6. CONTEXT MATTERS: Dress for your actual life, not an aspirational one. Every recommendation should work for the user's real lifestyle.

7. CONFIDENCE THROUGH SIMPLICITY: The goal is to look effortlessly well-dressed, never costumey or try-hard.

Reference brands for tone: Ralph Lauren, COS, ARKET, MANGO Man, APC, Norse Projects. The aesthetic is clean, premium, and confident without being intimidating.`

export async function generateStyleProfile(
  assessment: AssessmentFormData
): Promise<StyleProfileSummary> {
  const prompt = `${FOUNDER_PHILOSOPHY}

Based on the following style assessment, generate a personalized style profile summary. This is shown to the user BEFORE they pay, so it must be compelling, specific, and demonstrate that you truly understand them.

ASSESSMENT DATA:
- Name: ${assessment.firstName} ${assessment.lastName}
- Age: ${assessment.age}
- Location: ${assessment.location}
- Height: ${assessment.heightFeet}'${assessment.heightInches}"
- Body Type: ${assessment.bodyType}
- Fit Preference: ${assessment.fitPreference}
- Lifestyle: ${assessment.lifestyleContext?.join(", ")}
- Style Goal: ${assessment.styleGoal}
- Brands They Like: ${assessment.brandsLiked?.join(", ")}
- Style References: ${assessment.styleReferences?.join(", ")}
- Color Preferences: ${assessment.colorPreferences?.join(", ")}
- Colors to Avoid: ${assessment.colorsToAvoid?.join(", ")}
- Budget: ${assessment.budgetRange}
- Wardrobe Gaps: ${assessment.wardrobeGaps?.join(", ")}

Respond in VALID JSON with this exact structure:
{
  "headline": "A compelling 5-8 word headline that captures their style identity (e.g. 'The Modern Minimalist with Edge')",
  "body": "A 2-3 paragraph personalized summary (100-150 words) that demonstrates deep understanding of their style needs, current situation, and potential. Be specific to their inputs — reference their lifestyle, body type, and preferences directly. Make them feel understood and excited about what's possible.",
  "archetype": "A 2-3 word style archetype label",
  "keyTraits": ["trait1", "trait2", "trait3", "trait4"],
  "colorPalette": ["color1", "color2", "color3", "color4", "color5"],
  "brandPreview": ["brand1", "brand2", "brand3", "brand4"]
}

Ensure colorPalette contains actual color names that would work for this person. BrandPreview should be 4 brands from the appropriate tier based on their budget.`

  const { text } = await generateText({
    model: getModel(),
    prompt,
    temperature: 0.7,
  })

  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
  return JSON.parse(cleaned)
}

export async function generateFullStyleGuide(
  assessment: AssessmentFormData,
  profileSummary: StyleProfileSummary
): Promise<StyleGuideContent> {
  const prompt = `${FOUNDER_PHILOSOPHY}

Generate a comprehensive, personalized style guide for this user. Every recommendation must be SPECIFIC — real brand names, real product types, estimated price ranges.

USER PROFILE:
- Name: ${assessment.firstName}
- Age: ${assessment.age}
- Location: ${assessment.location}
- Height: ${assessment.heightFeet}'${assessment.heightInches}"
- Body Type: ${assessment.bodyType}
- Fit Preference: ${assessment.fitPreference}
- Top Size: ${assessment.typicalTopSize}
- Bottom Size: ${assessment.typicalBottomSize}
- Shoe Size: ${assessment.shoeSize}
- Waist: ${assessment.waist}", Chest: ${assessment.chest}", Inseam: ${assessment.inseam}"
- Style Archetype: ${profileSummary.archetype}
- Lifestyle: ${assessment.lifestyleContext?.join(", ")}
- Style Goal: ${assessment.styleGoal}
- Brands They Like: ${assessment.brandsLiked?.join(", ")}
- Brand Fit References: ${assessment.brandFitReferences?.join(", ")}
- Style References: ${assessment.styleReferences?.join(", ")}
- Color Preferences: ${assessment.colorPreferences?.join(", ")}
- Colors to Avoid: ${assessment.colorsToAvoid?.join(", ")}
- Recommended Palette: ${profileSummary.colorPalette?.join(", ")}
- Budget: ${assessment.budgetRange}
- Wardrobe Gaps: ${assessment.wardrobeGaps?.join(", ")}
- Shopping Behavior: ${assessment.shoppingBehavior}
- Additional Notes: ${assessment.additionalNotes}

Respond in VALID JSON with this exact structure:
{
  "introduction": "A personalized 2-3 paragraph introduction (150-200 words) addressing them by first name, explaining the philosophy behind their guide, and what to expect.",
  "recommendations": [
    {
      "id": "rec-1",
      "category": "tops",
      "itemName": "Specific product name (e.g. 'Heavyweight Cotton Crew Neck T-Shirt')",
      "brand": "Brand Name",
      "reasoning": "One concise sentence explaining why this specific item works for them.",
      "priceRange": "$XX-$XX",
      "priority": "essential"
    }
  ],
  "lookbooks": [
    {
      "id": "look-1",
      "title": "Lookbook title (e.g. 'Monday Meeting')",
      "description": "2-3 sentences describing this outfit and when to wear it.",
      "occasion": "work",
      "items": ["rec-1", "rec-5", "rec-8"]
    }
  ],
  "generalAdvice": "3-4 paragraphs of personalized style advice covering fit tips for their body type, how to build outfits from these pieces, care/maintenance tips, and seasonal considerations. 200-300 words."
}

Generate exactly:
- 15-20 recommendations across categories: tops (4-5), bottoms (3-4), outerwear (2-3), footwear (2-3), accessories (2-3), layering (1-2)
- 4-5 lookbooks combining the recommended items
- Each recommendation MUST have a unique id starting with "rec-"
- Priority should be: ~40% essential, ~40% recommended, ~20% optional
- Lookbook items array should reference recommendation ids`

  const { text } = await generateText({
    model: getModel(),
    prompt,
    temperature: 0.7,
    maxTokens: 4000,
  })

  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
  return JSON.parse(cleaned)
}