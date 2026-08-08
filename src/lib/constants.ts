// ─── Pricing ────────────────────────────────────────────────────────────────

export const GUIDE_PRICE_CENTS = 9800 // $98.00
export const GUIDE_PRICE_DISPLAY = "$98"
export const GUIDE_CURRENCY = "usd"

// ─── Assessment ─────────────────────────────────────────────────────────────

export const ASSESSMENT_STEPS = [
  "basics",
  "measurements",
  "body-fit",
  "lifestyle",
  "style-preferences",
  "brands",
  "colors",
  "budget",
  "final",
] as const

export type AssessmentStep = (typeof ASSESSMENT_STEPS)[number]

export const BODY_TYPES = [
  { value: "slim", label: "Slim" },
  { value: "athletic", label: "Athletic" },
  { value: "average", label: "Average" },
  { value: "broad", label: "Broad" },
  { value: "stocky", label: "Stocky" },
  { value: "tall_slim", label: "Tall & Slim" },
  { value: "tall_broad", label: "Tall & Broad" },
] as const

export const FIT_PREFERENCES = [
  { value: "slim", label: "Slim", description: "Close to the body, modern cut" },
  { value: "tailored", label: "Tailored", description: "Structured but not tight" },
  { value: "relaxed", label: "Relaxed", description: "Easy and comfortable, room to move" },
  { value: "oversized", label: "Oversized", description: "Intentionally loose, contemporary" },
] as const

export const BUDGET_RANGES = [
  { value: "moderate", label: "Moderate", description: "$50–150 per piece" },
  { value: "premium", label: "Premium", description: "$150–400 per piece" },
  { value: "luxury", label: "Luxury", description: "$400+ per piece" },
  { value: "mixed", label: "Mixed", description: "Varies by category" },
] as const

export const LIFESTYLE_CONTEXTS = [
  "Remote work / casual office",
  "Corporate office",
  "Creative industry",
  "Social outings / nightlife",
  "Weekend casual",
  "Date nights",
  "Travel",
  "Outdoor activities",
] as const

export const STYLE_GOALS = [
  "Day-to-day confidence",
  "Professional presence",
  "Dating / social appeal",
  "Creative expression",
  "Elevated basics",
  "Complete wardrobe overhaul",
] as const

export const TOP_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const
export const BOTTOM_SIZES = [
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "36",
  "38",
  "40",
  "42",
] as const

// ─── Brand Universe ─────────────────────────────────────────────────────────

export const BRAND_TIERS = {
  accessible: [
    "Uniqlo",
    "Zara",
    "H&M",
    "COS",
    "ARKET",
    "MANGO Man",
    "J.Crew",
    "Banana Republic",
    "Abercrombie & Fitch",
    "Gap",
  ],
  premium: [
    "Ralph Lauren",
    "Tommy Hilfiger",
    "Theory",
    "Club Monaco",
    "Reiss",
    "AllSaints",
    "Sandro",
    "APC",
    "Norse Projects",
    "Aimé Leon Dore",
    "Kith",
    "Todd Snyder",
  ],
  luxury: [
    "Loro Piana",
    "Brunello Cucinelli",
    "Zegna",
    "Tom Ford",
    "Saint Laurent",
    "Celine",
    "Ami Paris",
    "Jacquemus",
    "Lemaire",
    "The Row",
  ],
} as const

// ─── Guide ──────────────────────────────────────────────────────────────────

export const GUIDE_CATEGORIES = [
  "tops",
  "bottoms",
  "outerwear",
  "footwear",
  "accessories",
  "layering",
] as const

export const GUIDE_GENERATION_ANIMATION_DURATION_MS = 45_000 // 45 seconds

export const GUIDE_DELIVERY_MESSAGE =
  "Your guide is being reviewed by our stylist. Expect delivery within 1–3 business days."

// ─── App ────────────────────────────────────────────────────────────────────

export const APP_NAME = "Fitted"
export const APP_TAGLINE = "Your Personal Style Guide"
export const APP_DESCRIPTION =
  "Expert-curated, personalized wardrobe recommendations for men who want to dress better without the effort."
export const APP_URL = "https://fitted.style"
export const SUPPORT_EMAIL = "hello@fitted.style"