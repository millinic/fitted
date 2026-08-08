import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type {
  users,
  styleAssessments,
  styleProfileSummaries,
  payments,
  styleGuides,
  guideFeedback,
  knowledgeBaseEntries,
} from "@/lib/db/schema"

// ─── Database Model Types ──────────────────────────────────────────

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type StyleAssessment = InferSelectModel<typeof styleAssessments>
export type NewStyleAssessment = InferInsertModel<typeof styleAssessments>

export type StyleProfileSummary = InferSelectModel<typeof styleProfileSummaries>
export type NewStyleProfileSummary = InferInsertModel<typeof styleProfileSummaries>

export type Payment = InferSelectModel<typeof payments>
export type NewPayment = InferInsertModel<typeof payments>

export type StyleGuide = InferSelectModel<typeof styleGuides>
export type NewStyleGuide = InferInsertModel<typeof styleGuides>

export type GuideFeedback = InferSelectModel<typeof guideFeedback>
export type NewGuideFeedback = InferInsertModel<typeof guideFeedback>

export type KnowledgeBaseEntry = InferSelectModel<typeof knowledgeBaseEntries>
export type NewKnowledgeBaseEntry = InferInsertModel<typeof knowledgeBaseEntries>

// ─── Assessment Form Types ─────────────────────────────────────────

export type BodyType = "slim" | "athletic" | "average" | "stocky" | "tall_lean" | "broad"
export type FitPreference = "slim" | "tailored" | "relaxed" | "oversized"
export type BudgetRange = "moderate" | "premium" | "luxury"

export interface AssessmentFormData {
  // Measurements
  waistSize: string
  chestSize: string
  inseam: string
  typicalShirtSize: string
  typicalPantSize: string
  shoeSize: string
  height: string

  // Body & Fit
  bodyType: BodyType | ""
  fitPreference: FitPreference | ""

  // Brand Fit References
  brandFitReferences: string[]

  // Lifestyle
  lifestyleContext: string[]
  lifestyleFrequency: Record<string, string>

  // Style
  styleGoals: string[]
  brandsLiked: string[]
  styleReferences: string[]
  colorPreferences: string[]
  colorsToAvoid: string[]

  // Wardrobe & Budget
  wardrobeGaps: string[]
  budgetRange: BudgetRange | ""
  shoppingBehavior: string

  // Notes
  additionalNotes: string
}

// ─── Style Profile Summary Types ───────────────────────────────────

export interface StyleProfileSummaryContent {
  styleArchetype: string
  aestheticDescription: string
  keyPrinciples: string[]
  recommendedBrands: string[]
  colorPalette: string[]
  fitGuidance: string
}

// ─── Style Guide Types ─────────────────────────────────────────────

export interface GuideItem {
  name: string
  brand: string
  description: string
  reasoning: string
  purchaseUrl: string
  affiliateUrl?: string
  imageUrl?: string
  priceRange: string
}

export interface GuideSection {
  category: string
  items: GuideItem[]
}

export interface Lookbook {
  name: string
  description: string
  items: string[]
  imageUrl?: string
}

export interface StyleGuideContent {
  sections: GuideSection[]
  lookbooks: Lookbook[]
  generalTips: string[]
}

// ─── Guide Status ──────────────────────────────────────────────────

export type GuideStatus =
  | "generating"
  | "pending_review"
  | "approved"
  | "rejected"
  | "delivered"

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"

// ─── API Response Types ────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// ─── Session Extension ─────────────────────────────────────────────

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