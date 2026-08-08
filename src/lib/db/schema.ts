import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core"

// ── Enums ──────────────────────────────────────────────

export const bodyTypeEnum = pgEnum("body_type", [
  "slim",
  "athletic",
  "average",
  "broad",
  "stocky",
  "tall_lean",
])

export const fitPreferenceEnum = pgEnum("fit_preference", [
  "slim",
  "tailored",
  "relaxed",
  "oversized",
])

export const guideStatusEnum = pgEnum("guide_status", [
  "pending_generation",
  "generating",
  "pending_review",
  "revision_requested",
  "approved",
  "delivered",
])

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
])

// ── NextAuth Required Tables ───────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
})

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

// ── Style Assessment ───────────────────────────────────

export const styleAssessments = pgTable("style_assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Measurements
  waistSize: integer("waist_size"),
  chestSize: integer("chest_size"),
  inseam: integer("inseam"),
  typicalShirtSize: varchar("typical_shirt_size", { length: 10 }),
  typicalPantSize: varchar("typical_pant_size", { length: 10 }),
  shoeSize: varchar("shoe_size", { length: 10 }),
  height: varchar("height", { length: 20 }),

  // Body & Fit
  bodyType: bodyTypeEnum("body_type"),
  fitPreference: fitPreferenceEnum("fit_preference"),

  // Brand References
  brandFitReferences: jsonb("brand_fit_references").$type<string[]>(),
  brandsLiked: jsonb("brands_liked").$type<string[]>(),

  // Lifestyle & Context
  lifestyleContext: jsonb("lifestyle_context").$type<string[]>(),
  lifestyleFrequency: jsonb("lifestyle_frequency").$type<
    Record<string, string>
  >(),
  styleGoals: jsonb("style_goals").$type<string[]>(),
  styleReferences: jsonb("style_references").$type<string[]>(),

  // Preferences
  colorPreferences: jsonb("color_preferences").$type<string[]>(),
  wardrobeGaps: jsonb("wardrobe_gaps").$type<string[]>(),
  budgetRange: varchar("budget_range", { length: 50 }),
  shoppingBehavior: text("shopping_behavior"),

  // Meta
  completedAt: timestamp("completed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// ── Style Profile Summary (Pre-Paywall) ────────────────

export const styleProfiles = pgTable("style_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => styleAssessments.id, { onDelete: "cascade" }),
  summaryContent: jsonb("summary_content").$type<StyleProfileSummary>(),
  generatedAt: timestamp("generated_at", { mode: "date" }).defaultNow().notNull(),
})

// ── Payments ───────────────────────────────────────────

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  stripeSessionId: text("stripe_session_id").unique(),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("usd"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// ── Style Guides (Post-Payment) ────────────────────────

export const styleGuides = pgTable("style_guides", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => styleAssessments.id, { onDelete: "cascade" }),
  paymentId: uuid("payment_id")
    .notNull()
    .references(() => payments.id, { onDelete: "cascade" }),

  // Guide Content
  guideContent: jsonb("guide_content").$type<StyleGuideContent>(),

  // Review Workflow
  status: guideStatusEnum("status").notNull().default("pending_generation"),
  founderNotes: text("founder_notes"),
  reviewedAt: timestamp("reviewed_at", { mode: "date" }),

  // Delivery
  deliveredAt: timestamp("delivered_at", { mode: "date" }),
  emailSentAt: timestamp("email_sent_at", { mode: "date" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// ── User Feedback ──────────────────────────────────────

export const guideFeedback = pgTable("guide_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  guideId: uuid("guide_id")
    .notNull()
    .references(() => styleGuides.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  overallRating: integer("overall_rating"),
  feltPersonalized: boolean("felt_personalized"),
  comments: text("comments"),
  flaggedItems: jsonb("flagged_items").$type<string[]>(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

// ── Knowledge Base ─────────────────────────────────────

export const knowledgeBase = pgTable("knowledge_base", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// ── Type Interfaces for JSONB Columns ──────────────────

export interface StyleProfileSummary {
  headline: string
  styleArchetype: string
  keyInsights: string[]
  fitSummary: string
  colorPalette: string[]
  brandAffinities: string[]
}

export interface StyleGuideContent {
  introduction: string
  sections: StyleGuideSection[]
  lookbooks: LookbookEntry[]
}

export interface StyleGuideSection {
  category: string
  items: StyleGuideItem[]
}

export interface StyleGuideItem {
  name: string
  brand: string
  description: string
  reasoning: string
  purchaseUrl: string
  affiliateUrl?: string
  imageUrl?: string
  priceRange: string
}

export interface LookbookEntry {
  title: string
  description: string
  imageUrl?: string
  itemIds: string[]
}