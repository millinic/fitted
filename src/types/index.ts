import type {
  GuideRecommendation,
  GuideLookbook,
} from "@/lib/db/schema"

// ─── Assessment Types ───────────────────────────────────────────────────────

export type BodyType =
  | "slim"
  | "athletic"
  | "average"
  | "broad"
  | "stocky"
  | "tall_slim"
  | "tall_broad"

export type FitPreference = "slim" | "tailored" | "relaxed" | "oversized"

export type BudgetRange = "moderate" | "premium" | "luxury" | "mixed"

export type GuideStatus =
  | "generating"
  | "pending_review"
  | "approved"
  | "revision_requested"
  | "delivered"

export interface AssessmentFormData {
  // Basics
  firstName: string
  lastName: string
  age: number | null
  location: string

  // Measurements
  heightFeet: number | null
  heightInches: number | null
  waist: number | null
  chest: number | null
  inseam: number | null
  shoeSize: string
  typicalTopSize: string
  typicalBottomSize: string

  // Body & Fit
  bodyType: BodyType | null
  fitPreference: FitPreference | null

  // Brand fit references
  brandFitReferences: string[]

  // Lifestyle
  lifestyleContext: string[]
  lifestyleFrequency: Record<string, string>

  // Style preferences
  styleGoal: string
  brandsLiked: string[]
  styleReferences: string[]
  colorPreferences: string[]
  colorsToAvoid: string[]
  wardrobeGaps: string[]

  // Budget & shopping
  budgetRange: BudgetRange | null
  monthlyBudget: number | null
  shoppingBehavior: string

  // Additional
  additionalNotes: string
}

// ─── Style Profile (pre-paywall) ────────────────────────────────────────────

export interface StyleProfileSummary {
  headline: string
  body: string
  archetype: string
  keyTraits: string[]
  colorPalette: string[]
  brandPreview: string[]
}

// ─── Style Guide (post-payment) ─────────────────────────────────────────────

export interface StyleGuideContent {
  introduction: string
  recommendations: GuideRecommendation[]
  lookbooks: GuideLookbook[]
  generalAdvice: string
}

// ─── Payment ────────────────────────────────────────────────────────────────

export interface PaymentIntent {
  clientSecret: string
  paymentIntentId: string
  amount: number
  currency: string
}

// ─── Review Queue (Founder) ─────────────────────────────────────────────────

export interface ReviewQueueItem {
  guideId: string
  assessmentId: string
  userName: string
  userEmail: string
  status: GuideStatus
  createdAt: Date
  styleArchetype: string | null
}

// ─── Session Extension ──────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string
  }
}

// ─── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}