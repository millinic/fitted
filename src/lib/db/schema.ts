import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  jsonb,
  pgEnum,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import type { AdapterAccount } from "@auth/core/adapters"

// ─── NextAuth Tables ───────────────────────────────────────────────

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
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

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
)

// ─── Enums ─────────────────────────────────────────────────────────

export const bodyTypeEnum = pgEnum("body_type", [
  "slim",
  "athletic",
  "average",
  "stocky",
  "tall_lean",
  "broad",
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
])

export const guideStatusEnum = pgEnum("guide_status", [
  "generating",
  "pending_review",
  "approved",
  "rejected",
  "delivered",
])

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
])

// ─── Style Assessment ──────────────────────────────────────────────

export const styleAssessments = pgTable("style_assessment", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Measurements & Sizing
  waistSize: varchar("waist_size", { length: 10 }),
  chestSize: varchar("chest_size", { length: 10 }),
  inseam: varchar("inseam", { length: 10 }),
  typicalShirtSize: varchar("typical_shirt_size", { length: 10 }),
  typicalPantSize: varchar("typical_pant_size", { length: 10 }),
  shoeSize: varchar("shoe_size", { length: 10 }),
  height: varchar("height", { length: 10 }),

  // Body & Fit
  bodyType: bodyTypeEnum("body_type"),
  fitPreference: fitPreferenceEnum("fit_preference"),

  // Brand Fit References — brands that generally fit well
  brandFitReferences: jsonb("brand_fit_references").$type<string[]>(),

  // Lifestyle Context
  lifestyleContext: jsonb("lifestyle_context").$type<string[]>(),
  lifestyleFrequency: jsonb("lifestyle_frequency").$type<
    Record<string, string>
  >(),

  // Style
  styleGoals: jsonb("style_goals").$type<string[]>(),
  brandsLiked: jsonb("brands_liked").$type<string[]>(),
  styleReferences: jsonb("style_references").$type<string[]>(),
  colorPreferences: jsonb("color_preferences").$type<string[]>(),
  colorsToAvoid: jsonb("colors_to_avoid").$type<string[]>(),

  // Wardrobe
  wardrobeGaps: jsonb("wardrobe_gaps").$type<string[]>(),

  // Budget & Shopping
  budgetRange: budgetRangeEnum("budget_range"),
  shoppingBehavior: text("shopping_behavior"),

  // Additional notes
  additionalNotes: text("additional_notes"),

  // Status
  completedAt: timestamp("completed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// ─── Style Profile Summary (pre-paywall) ──────────────────────────

export const styleProfileSummaries = pgTable("style_profile_summary", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => styleAssessments.id, { onDelete: "cascade" }),

  // AI-generated summary content
  summaryContent: jsonb("summary_content").$type<{
    styleArchetype: string
    aestheticDescription: string
    keyPrinciples: string[]
    recommendedBrands: string[]
    colorPalette: string[]
    fitGuidance: string
  }>(),

  generatedAt: timestamp("generated_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

// ─── Payments ──────────────────────────────────────────────────────

export const payments = pgTable("payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => styleAssessments.id, { onDelete: "cascade" }),

  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSessionId: text("stripe_session_id"),
  amount: integer("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// ─── Style Guides (post-payment, AI-generated) ────────────────────

export const styleGuides = pgTable("style_guide", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => styleAssessments.id, { onDelete: "cascade" }),
  paymentId: uuid("payment_id")
    .notNull()
    .references(() => payments.id, { onDelete: "cascade" }),

  // Guide content
  guideContent: jsonb("guide_content").$type<{
    sections: Array<{
      category: string
      items: Array<{
        name: string
        brand: string
        description: string
        reasoning: string
        purchaseUrl: string
        affiliateUrl?: string
        imageUrl?: string
        priceRange: string
      }>
    }>
    lookbooks: Array<{
      name: string
      description: string
      items: string[]
      imageUrl?: string
    }>
    generalTips: string[]
  }>(),

  // Review
  status: guideStatusEnum("status").default("generating").notNull(),
  founderNotes: text("founder_notes"),
  reviewedAt: timestamp("reviewed_at", { mode: "date" }),

  // Delivery
  deliveredAt: timestamp("delivered_at", { mode: "date" }),
  emailSentAt: timestamp("email_sent_at", { mode: "date" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// ─── User Feedback ─────────────────────────────────────────────────

export const guideFeedback = pgTable("guide_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  guideId: uuid("guide_id")
    .notNull()
    .references(() => styleGuides.id, { onDelete: "cascade" }),

  overallRating: integer("overall_rating"), // 1-5
  personalizedFeeling: integer("personalized_feeling"), // 1-5
  wouldRefer: boolean("would_refer"),
  flaggedItems: jsonb("flagged_items").$type<
    Array<{
      itemName: string
      reason: string
    }>
  >(),
  freeformFeedback: text("freeform_feedback"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

// ─── Knowledge Base ────────────────────────────────────────────────

export const knowledgeBaseEntries = pgTable("knowledge_base_entry", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: varchar("category", { length: 100 }).notNull(), // 'philosophy', 'brand', 'style_icon', 'principle', 'publication'
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// ─── Relations ─────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  assessments: many(styleAssessments),
  profileSummaries: many(styleProfileSummaries),
  payments: many(payments),
  styleGuides: many(styleGuides),
  feedback: many(guideFeedback),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const styleAssessmentsRelations = relations(
  styleAssessments,
  ({ one, many }) => ({
    user: one(users, {
      fields: [styleAssessments.userId],
      references: [users.id],
    }),
    profileSummaries: many(styleProfileSummaries),
    payments: many(payments),
    styleGuides: many(styleGuides),
  })
)

export const styleProfileSummariesRelations = relations(
  styleProfileSummaries,
  ({ one }) => ({
    user: one(users, {
      fields: [styleProfileSummaries.userId],
      references: [users.id],
    }),
    assessment: one(styleAssessments, {
      fields: [styleProfileSummaries.assessmentId],
      references: [styleAssessments.id],
    }),
  })
)

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  assessment: one(styleAssessments, {
    fields: [payments.assessmentId],
    references: [styleAssessments.id],
  }),
}))

export const styleGuidesRelations = relations(
  styleGuides,
  ({ one, many }) => ({
    user: one(users, {
      fields: [styleGuides.userId],
      references: [users.id],
    }),
    assessment: one(styleAssessments, {
      fields: [styleGuides.assessmentId],
      references: [styleAssessments.id],
    }),
    payment: one(payments, {
      fields: [styleGuides.paymentId],
      references: [payments.id],
    }),
    feedback: many(guideFeedback),
  })
)

export const guideFeedbackRelations = relations(guideFeedback, ({ one }) => ({
  user: one(users, {
    fields: [guideFeedback.userId],
    references: [users.id],
  }),
  guide: one(styleGuides, {
    fields: [guideFeedback.guideId],
    references: [styleGuides.id],
  }),
}))