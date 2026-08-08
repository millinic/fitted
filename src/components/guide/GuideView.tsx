"use client"

import { useState } from "react"
import type { StyleGuideContent } from "@/types"
import type { GuideRecommendation, GuideLookbook } from "@/lib/db/schema"
import { Card } from "@/components/ui/Card"
import { Footer } from "@/components/layout/Footer"
import { GUIDE_CATEGORIES } from "@/lib/constants"

interface GuideViewProps {
  firstName: string
  archetype: string
  guide: StyleGuideContent
}

export function GuideView({ firstName, archetype, guide }: GuideViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const filteredRecommendations =
    activeCategory === "all"
      ? guide.recommendations
      : guide.recommendations.filter((r) => r.category === activeCategory)

  const categories = [
    { value: "all", label: "All" },
    ...GUIDE_CATEGORIES.map((c) => ({
      value: c,
      label: c.charAt(0).toUpperCase() + c.slice(1),
    })),
  ]

  const priorityOrder: Record<string, number> = { essential: 0, recommended: 1, optional: 2 }
  const sortedRecommendations = [...filteredRecommendations].sort(
    (a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2)
  )

  return (
    <>
      <div className="bg-brand-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-600 mb-3">
              Your Personal Style Guide
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif text-neutral-900 mb-2">
              {firstName}&apos;s Wardrobe Guide
            </h1>
            {archetype && (
              <span className="inline-block px-4 py-1.5 bg-neutral-900 text-white rounded-full text-sm font-medium mt-3">
                {archetype}
              </span>
            )}
          </div>

          {/* Introduction */}
          <Card variant="elevated" className="mb-12">
            <h2 className="font-serif text-xl text-neutral-900 mb-4">Introduction</h2>
            <div className="space-y-3">
              {guide.introduction.split("\n\n").map((p, i) => (
                <p key={i} className="text-neutral-700 leading-relaxed">{p}</p>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-neutral-900 mb-6">Recommendations</h2>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => {
                const count =
                  cat.value === "all"
                    ? guide.recommendations.length
                    : guide.recommendations.filter((r) => r.category === cat.value).length
                if (count === 0 && cat.value !== "all") return null
                return (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat.value
                        ? "bg-neutral-900 text-white"
                        : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                )
              })}
            </div>

            {/* Recommendation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedRecommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>

            {sortedRecommendations.length === 0 && (
              <p className="text-center text-neutral-500 py-8">
                No recommendations in this category.
              </p>
            )}
          </div>

          {/* Lookbooks */}
          {guide.lookbooks.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-neutral-900 mb-6">Outfit Lookbooks</h2>
              <p className="text-neutral-500 mb-6">
                Complete outfits built from your recommended pieces. Use these as starting points to build your daily looks.
              </p>
              <div className="space-y-6">
                {guide.lookbooks.map((lookbook) => (
                  <LookbookCard
                    key={lookbook.id}
                    lookbook={lookbook}
                    recommendations={guide.recommendations}
                  />
                ))}
              </div>
            </div>
          )}

          {/* General Advice */}
          <Card variant="elevated" className="mb-12">
            <h2 className="font-serif text-xl text-neutral-900 mb-4">Personalized Style Advice</h2>
            <div className="space-y-3">
              {guide.generalAdvice.split("\n\n").map((p, i) => (
                <p key={i} className="text-neutral-700 leading-relaxed">{p}</p>
              ))}
            </div>
          </Card>

          {/* Bottom CTA */}
          <div className="text-center py-8">
            <p className="text-neutral-500 text-sm">
              Questions about your guide? Reach out to us anytime.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

function RecommendationCard({ recommendation }: { recommendation: GuideRecommendation }) {
  const priorityStyles: Record<string, string> = {
    essential: "bg-neutral-900 text-white",
    recommended: "bg-brand-200 text-brand-800",
    optional: "bg-neutral-100 text-neutral-600",
  }

  return (
    <Card variant="bordered" className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="font-medium text-neutral-900 leading-snug">{recommendation.itemName}</p>
          <p className="text-sm text-brand-600 mt-0.5">{recommendation.brand}</p>
        </div>
        <span
          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
            priorityStyles[recommendation.priority] || priorityStyles.optional
          }`}
        >
          {recommendation.priority}
        </span>
      </div>

      <p className="text-sm text-neutral-600 leading-relaxed flex-1">{recommendation.reasoning}</p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
        <span className="text-xs text-neutral-400 uppercase tracking-wide">
          {recommendation.category}
        </span>
        {recommendation.priceRange && (
          <span className="text-sm font-medium text-neutral-700">{recommendation.priceRange}</span>
        )}
      </div>

      {(recommendation.purchaseUrl || recommendation.affiliateUrl) && (
        <a
          href={recommendation.affiliateUrl || recommendation.purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-center py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors block"
        >
          Shop Now →
        </a>
      )}
    </Card>
  )
}

function LookbookCard({
  lookbook,
  recommendations,
}: {
  lookbook: GuideLookbook
  recommendations: GuideRecommendation[]
}) {
  const lookbookItems = lookbook.items
    .map((itemId) => recommendations.find((r) => r.id === itemId))
    .filter(Boolean) as GuideRecommendation[]

  return (
    <Card variant="bordered">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-serif text-lg text-neutral-900">{lookbook.title}</h3>
          <span className="text-xs text-brand-600 uppercase tracking-wide font-medium">{lookbook.occasion}</span>
        </div>
      </div>

      <p className="text-neutral-600 leading-relaxed mb-4">{lookbook.description}</p>

      {lookbookItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Pieces in this look</p>
          <div className="flex flex-wrap gap-2">
            {lookbookItems.map((item) => (
              <span
                key={item.id}
                className="px-3 py-1.5 bg-brand-50 border border-brand-200 text-neutral-700 rounded-lg text-sm"
              >
                {item.brand} — {item.itemName}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}