export const APP_NAME = "Fitted" as const
export const APP_DESCRIPTION =
  "A personalized men's style platform that delivers an expert-curated wardrobe guide." as const
export const APP_URL = "https://fitted.style" as const

// Pricing
export const GUIDE_PRICE_CENTS = 9800 as const
export const GUIDE_PRICE_DISPLAY = "$98" as const
export const GUIDE_CURRENCY = "usd" as const

// Assessment
export const ASSESSMENT_MAX_MINUTES = 10 as const

// Guide delivery
export const GUIDE_GENERATION_ANIMATION_SECONDS = 45 as const
export const GUIDE_DELIVERY_DAYS_MIN = 1 as const
export const GUIDE_DELIVERY_DAYS_MAX = 3 as const

// Body types
export const BODY_TYPES = [
  { value: "slim", label: "Slim" },
  { value: "athletic", label: "Athletic" },
  { value: "average", label: "Average" },
  { value: "broad", label: "Broad" },
  { value: "stocky", label: "Stocky" },
  { value: "tall_lean", label: "Tall & Lean" },
] as const

// Fit preferences
export const FIT_PREFERENCES = [
  { value: "slim", label: "Slim Fit" },
  { value: "tailored", label: "Tailored" },
  { value: "relaxed", label: "Relaxed" },
  { value: "oversized", label: "Oversized" },
] as const

// Budget ranges
export const BUDGET_RANGES = [
  { value: "moderate", label: "$50–$150 per item" },
  { value: "upper_moderate", label: "$100–$250 per item" },
  { value: "premium", label: "$200–$500 per item" },
  { value: "luxury", label: "$500+ per item" },
] as const

// Lifestyle contexts
export const LIFESTYLE_CONTEXTS = [
  { value: "office", label: "Office / Professional" },
  { value: "remote_work", label: "Remote / Work from Home" },
  { value: "creative", label: "Creative / Studio" },
  { value: "social", label: "Social / Going Out" },
  { value: "casual", label: "Everyday Casual" },
  { value: "date", label: "Date Night" },
  { value: "travel", label: "Travel" },
] as const

// Style goals
export const STYLE_GOALS = [
  { value: "daily_confidence", label: "Day-to-day confidence" },
  { value: "professional", label: "Professional presence" },
  { value: "dating", label: "Dating & social life" },
  { value: "elevated_basics", label: "Elevated basics" },
  { value: "wardrobe_overhaul", label: "Full wardrobe overhaul" },
  { value: "specific_events", label: "Specific events or occasions" },
] as const

// Reference brands (for the assessment)
export const REFERENCE_BRANDS = [
  "Ralph Lauren",
  "Tommy Hilfiger",
  "COS",
  "MANGO Man",
  "Zara",
  "J.Crew",
  "Banana Republic",
  "Club Monaco",
  "Theory",
  "AllSaints",
  "Reiss",
  "Ted Baker",
  "Hugo Boss",
  "Nike",
  "Adidas",
  "Uniqlo",
  "H&M",
  "Everlane",
  "Bonobos",
  "Todd Snyder",
  "Ami Paris",
  "A.P.C.",
  "Acne Studios",
  "Sandro",
] as const

// Shirt sizes
export const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const

// Color preferences
export const COLOR_FAMILIES = [
  { value: "neutrals", label: "Neutrals (black, white, grey, navy)" },
  { value: "earth_tones", label: "Earth Tones (olive, tan, brown, rust)" },
  { value: "cool_tones", label: "Cool Tones (blue, teal, slate)" },
  { value: "warm_tones", label: "Warm Tones (burgundy, camel, terracotta)" },
  { value: "muted", label: "Muted / Desaturated" },
  { value: "bold", label: "Bold / Saturated Pops" },
] as const

// Wardrobe gaps
export const WARDROBE_GAP_OPTIONS = [
  { value: "outerwear", label: "Outerwear & Jackets" },
  { value: "trousers", label: "Trousers & Pants" },
  { value: "shirts", label: "Shirts & Button-Downs" },
  { value: "knitwear", label: "Knitwear & Sweaters" },
  { value: "tshirts", label: "T-Shirts & Basics" },
  { value: "footwear", label: "Footwear" },
  { value: "accessories", label: "Accessories" },
  { value: "denim", label: "Denim" },
  { value: "tailoring", label: "Tailoring & Suiting" },
] as const