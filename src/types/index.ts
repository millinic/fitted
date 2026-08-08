import type {
  StyleProfileSummary,
  StyleGuideContent,
  StyleGuideSection,
  StyleGuideItem,
  LookbookEntry,
} from "@/lib/db/schema"

// Re-export schema types for convenience
export type {
  StyleProfileSummary,
  StyleGuideContent,
  StyleGuideSection,
  StyleGuideItem,
  LookbookEntry,
}

// ── Session Extension ──────────────────────────────────

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

// ── Assessment Types ───────────────────────────────────

export interface AssessmentFormData {
  // Measurements
  waistSize?: number
  chestSize?: number
  inseam?: number
  typicalShirtSize?: string
  typicalPantSize?: string
  shoeSize?: string
  height?: string

  // Body & Fit
  bodyType?: BodyType
  fitPreference?: FitPreference

  // Brand References
  brandFitReferences?: string[]
  brandsLiked?: string[]

  // Lifestyle & Context
  lifestyleContext?: string[]
  lifestyleFrequency?: Record<string, string>
  styleGoals?: string[]
  styleReferences?: string[]

  // Preferences
  colorPreferences?: string[]
  wardrobeGaps?: string[]
  budgetRange?: string
  shoppingBehavior?: string
}

export type BodyType =
  | "slim"
  | "athletic"
  | "average"
  | "broad"
  | "stocky"
  | "tall_lean"

export type FitPreference = "slim" | "tailored" | "relaxed" | "oversized"

export type GuideStatus =
  | "pending_generation"
  | "generating"
  | "pending_review"
  | "revision_requested"
  | "approved"
  | "delivered"

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"

// ── Assessment Step Configuration ──────────────────────

export interface AssessmentStep {
  id: string
  title: string
  description: string
  fields: string[]
}

// ── API Response Types ─────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
}

// ── Founder Review Types ───────────────────────────────

export interface ReviewAction {
  guideId: string
  action: "approve" | "request_revision"
  notes?: string
}

export interface ReviewQueueItem {
  guideId: string
  userId: string
  userName?: string
  userEmail?: string
  status: GuideStatus
  createdAt: Date
  assessmentSummary: string
}