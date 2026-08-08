// ─── Pricing ───────────────────────────────────────────────────────
export const GUIDE_PRICE_CENTS = 9800 // $98.00
export const GUIDE_PRICE_DISPLAY = "$98"
export const CURRENCY = "usd"

// ─── Assessment ────────────────────────────────────────────────────
export const ASSESSMENT_STEPS = [
  "measurements",
  "body-fit",
  "lifestyle",
  "style-preferences",
  "brands-references",
  "wardrobe-budget",
] as const

export type AssessmentStep = (typeof ASSESSMENT_STEPS)[number]

export const BODY_TYPES = [
  { value: "slim", label: "Slim" },
  { value: "athletic", label: "Athletic" },
  { value: "average", label: "Average" },
  { value: "stocky", label: "Stocky" },
  { value: "tall_lean", label: "Tall & Lean" },
  { value: "broad", label: "Broad" },
] as const

export const FIT_PREFERENCES = [
  { value: "slim", label: "Slim Fit" },
  { value: "tailored", label: "Tailored" },
  { value: "relaxed", label: "Relaxed" },
  { value: "oversized", label: "Oversized" },
] as const

export const BUDGET_RANGES = [
  { value: "moderate", label: "Moderate", description: "$50–150 per piece" },
  { value: "premium", label: "Premium", description: "$150–400 per piece" },
  { value: "luxury", label: "Luxury", description: "$400+ per piece" },
] as const

export const LIFESTYLE_CONTEXTS = [
  "Work (office)",
  "Work (remote/casual)",
  "Weekend casual",
  "Going out / nightlife",
  "Date nights",
  "Travel",
  "Creative / music events",
  "Business meetings",
] as const

export const STYLE_GOALS = [
  "Day-to-day confidence",
  "Professional presence",
  "Dating & social life",
  "Looking put-together effortlessly",
  "Developing a signature style",
  "Upgrading from basics",
] as const

export const WARDROBE_CATEGORIES = [
  "Outerwear & jackets",
  "Knitwear & sweaters",
  "Shirts & button-downs",
  "T-shirts & casual tops",
  "Trousers & chinos",
  "Denim",
  "Shorts",
  "Footwear",
  "Accessories",
] as const

// ─── Brand Universe (reference, not exhaustive) ────────────────────
export const BRAND_TIERS = {
  accessible: [
    "Uniqlo",
    "ZARA",
    "H&M",
    "COS",
    "ARKET",
    "Massimo Dutti",
    "MANGO Man",
  ],
  premium: [
    "Ralph Lauren",
    "Tommy Hilfiger",
    "Club Monaco",
    "A.P.C.",
    "Reiss",
    "AllSaints",
    "Theory",
    "Sandro",
    "Norse Projects",
    "Officine Générale",
  ],
  luxury: [
    "Loro Piana",
    "Brunello Cucinelli",
    "Zegna",
    "Tom Ford",
    "AMI Paris",
    "Lemaire",
    "Auralee",
  ],
} as const

// ─── App ───────────────────────────────────────────────────────────
export const APP_NAME = "Fitted"
export const APP_TAGLINE = "Your Personal Style, Expertly Curated"
export const APP_DESCRIPTION =
  "A personalized men's style platform that delivers an expert-curated wardrobe guide. Look consistently well-dressed without becoming fashion obsessed."
export const APP_URL = "https://fitted.style"

// ─── Guide Generation ──────────────────────────────────────────────
export const GUIDE_GENERATION_ANIMATION_DURATION_MS = 45_000 // 45 seconds
export const ESTIMATED_DELIVERY_DAYS = "1-3 business days"