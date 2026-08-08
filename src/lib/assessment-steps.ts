import type { AssessmentStep } from "@/types"

export const ASSESSMENT_STEPS: AssessmentStep[] = [
  {
    id: "measurements",
    title: "Measurements & Sizing",
    description: "Help us understand your fit. This ensures recommendations work for your body.",
    fields: ["height", "waistSize", "chestSize", "inseam", "typicalShirtSize", "typicalPantSize", "shoeSize"],
  },
  {
    id: "body_fit",
    title: "Body Type & Fit",
    description: "How you're built and how you like your clothes to fit.",
    fields: ["bodyType", "fitPreference"],
  },
  {
    id: "lifestyle",
    title: "Lifestyle & Context",
    description: "What does your typical week look like? We'll focus on what matters most.",
    fields: ["lifestyleContext", "lifestyleFrequency"],
  },
  {
    id: "goals",
    title: "Style Goals",
    description: "What are you hoping to achieve with your wardrobe?",
    fields: ["styleGoals"],
  },
  {
    id: "brands",
    title: "Brand Preferences",
    description: "Brands you already like or that generally fit you well.",
    fields: ["brandsLiked", "brandFitReferences"],
  },
  {
    id: "preferences",
    title: "Colors & Preferences",
    description: "Your color comfort zone and where your wardrobe needs work.",
    fields: ["colorPreferences", "wardrobeGaps"],
  },
  {
    id: "budget",
    title: "Budget & Shopping",
    description: "Your investment range and how you typically shop.",
    fields: ["budgetRange", "shoppingBehavior"],
  },
  {
    id: "references",
    title: "Style References",
    description: "Any style icons, celebrities, or influencers whose look you admire. This helps us understand your aesthetic.",
    fields: ["styleReferences"],
  },
]