import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
  boolean,
  pgEnum,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─── NextAuth Required Tables ───────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<"oauth" | "oidc" | "email" | "webauthn">().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
)

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
)

// ─── Style Assessment & Guide Tables ────────────────────────────────────────

export const bodyTypeEnum = pgEnum("body_type", [
  "slim",
  "athletic",
  "average",
  "broad",
  "stocky",
  "tall_slim",
  "tall_broad",
])

export const fitPreferenceEnum = pgEnum("fit_preference", [
  "slim",
  "tailored",
  "relaxed",
  "oversized",
])

export const budgetRangeEnum = pgEnum("budget_range", [
  "moderate",
  "premium",
  "luxury",
  "mixed",
])

export const guideStatusEnum = pgEnum("guide_status", [
  "generating",
  "pending_review",
  "approved",
  "revision_requested",
  "delivered",
])

export const assessments = pgTable("assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),

  // Contact / identity
  firstName: text("first_name"),
  lastName: text("last_name"),
  age: integer("age"),
  location: text("location"),

  // Measurements & sizing
  heightFeet: integer("height_feet"),
  heightInches: integer("height_inches"),
  waist: integer("waist"),
  chest: integer("chest"),
  inseam: integer("inseam"),
  shoeSize: text("shoe_size"),
  typicalTopSize: text("typical_top_size"),
  typicalBottomSize: text("typical_bottom_size"),

  // Body & fit
  bodyType: bodyTypeEnum("body_type"),
  fitPreference: fitPreferenceEnum("fit_preference"),

  // Brand fit references — brands that fit them well
  brandFitReferences: jsonb("brand_fit_references").$type<string[]>(),

  // Lifestyle
  lifestyleContext: jsonb("lifestyle_context").$type<string[]>(),
  lifestyleFrequency: jsonb("lifestyle_frequency").$type<
    Record<string, string>
  >(),

  // Style preferences
  styleGoal: text("style_goal"),
  brandsLiked: jsonb("brands_liked").$type<string[]>(),
  styleReferences: jsonb("style_references").$type<string[]>(),
  colorPreferences: jsonb("color_preferences").$type<string[]>(),
  colorsToAvoid: jsonb("colors_to_avoid").$type<string[]>(),
  wardrobeGaps: jsonb("wardrobe_gaps").$type<string[]>(),

  // Budget & shopping
  budgetRange: budgetRangeEnum("budget_range"),
  monthlyBudget: integer("monthly_budget"),
  shoppingBehavior: text("shopping_behavior"),

  // Additional context
  additionalNotes: text("additional_notes"),

  // Status
  completedAt: timestamp("completed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

export const styleProfiles = pgTable("style_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),

  // AI-generated summary shown before paywall
  summaryHeadline: text("summary_headline"),
  summaryBody: text("summary_body"),
  styleArchetype: text("style_archetype"),
  keyTraits: jsonb("key_traits").$type<string[]>(),
  colorPalette: jsonb("color_palette").$type<string[]>(),
  brandRecommendationPreview: jsonb("brand_recommendation_preview").$type<
    string[]
  >(),

  // Raw AI response for debugging
  rawAiResponse: jsonb("raw_ai_response"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

export const styleGuides = pgTable("style_guides", {
  id: uuid("id").defaultRandom().primaryKey(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  styleProfileId: uuid("style_profile_id").references(
    () => styleProfiles.id,
    { onDelete: "set null" }
  ),

  // Guide content
  introduction: text("introduction"),
  recommendations: jsonb("recommendations").$type<GuideRecommendation[]>(),
  lookbooks: jsonb("lookbooks").$type<GuideLookbook[]>(),
  generalAdvice: text("general_advice"),

  // Raw AI response for debugging
  rawAiResponse: jsonb("raw_ai_response"),

  // Review status
  status: guideStatusEnum("status").default("generating").notNull(),
  founderNotes: text("founder_notes"),
  reviewedAt: timestamp("reviewed_at", { mode: "date" }),
  deliveredAt: timestamp("delivered_at", { mode: "date" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// ─── Payments ───────────────────────────────────────────────────────────────

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  assessmentId: uuid("assessment_id").references(() => assessments.id, {
    onDelete: "set null",
  }),

  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  stripeCustomerId: text("stripe_customer_id"),
  amount: integer("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  status: text("status").notNull(), // succeeded, pending, failed
  receiptEmail: text("receipt_email"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

// ─── Knowledge Base ─────────────────────────────────────────────────────────

export const knowledgeBaseEntries = pgTable("knowledge_base_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category").notNull(), // philosophy, brands, icons, principles
  title: text("title").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// ─── User Feedback ──────────────────────────────────────────────────────────

export const guideFeedback = pgTable("guide_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  guideId: uuid("guide_id")
    .notNull()
    .references(() => styleGuides.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),

  overallRating: integer("overall_rating"), // 1-5
  comments: text("comments"),
  flaggedItems: jsonb("flagged_items").$type<string[]>(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

// ─── Relations ──────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  assessments: many(assessments),
  styleGuides: many(styleGuides),
  payments: many(payments),
}))

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  user: one(users, {
    fields: [assessments.userId],
    references: [users.id],
  }),
  styleProfile: one(styleProfiles),
  styleGuides: many(styleGuides),
  payments: many(payments),
}))

export const styleProfilesRelations = relations(styleProfiles, ({ one }) => ({
  assessment: one(assessments, {
    fields: [styleProfiles.assessmentId],
    references: [assessments.id],
  }),
  user: one(users, {
    fields: [styleProfiles.userId],
    references: [users.id],
  }),
}))

export const styleGuidesRelations = relations(
  styleGuides,
  ({ one, many }) => ({
    assessment: one(assessments, {
      fields: [styleGuides.assessmentId],
      references: [assessments.id],
    }),
    user: one(users, {
      fields: [styleGuides.userId],
      references: [users.id],
    }),
    styleProfile: one(styleProfiles, {
      fields: [styleGuides.styleProfileId],
      references: [styleProfiles.id],
    }),
    feedback: many(guideFeedback),
  })
)

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  assessment: one(assessments, {
    fields: [payments.assessmentId],
    references: [assessments.id],
  }),
}))

export const guideFeedbackRelations = relations(guideFeedback, ({ one }) => ({
  guide: one(styleGuides, {
    fields: [guideFeedback.guideId],
    references: [styleGuides.id],
  }),
  user: one(users, {
    fields: [guideFeedback.userId],
    references: [users.id],
  }),
}))

// ─── JSON Types ─────────────────────────────────────────────────────────────

export type GuideRecommendation = {
  id: string
  category: string // e.g. "tops", "bottoms", "outerwear", "footwear", "accessories"
  itemName: string
  brand: string
  reasoning: string // one-sentence expert reasoning
  purchaseUrl?: string
  affiliateUrl?: string
  imageUrl?: string
  priceRange?: string
  priority: "essential" | "recommended" | "optional"
}

export type GuideLookbook = {
  id: string
  title: string
  description: string
  occasion: string
  items: string[] // references to recommendation IDs
  imageUrl?: string
  referenceImageUrls?: string[]
}