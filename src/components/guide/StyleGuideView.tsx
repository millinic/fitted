"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserGuide } from "@/actions/guide"
import { Button } from "@/components/ui/Button"
import type { StyleGuide, StyleGuideContent, StyleProfileSummaryContent } from "@/types"

export function StyleGuideView() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [guide, setGuide] = useState<StyleGuide | null>(null)
  const [profileSummary, setProfileSummary] = useState<StyleProfileSummaryContent | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const result = await getUserGuide()
        if (result.success && result.data) {
          setGuide(result.data.guide)
          setProfileSummary(result.data.profileSummary)

          const content = result.data.guide?.guideContent as StyleGuideContent | null
          if (content?.sections?.length) {
            setActiveCategory(content.sections[0].category)
          }
        }
      } catch (err) {
        console.error("Failed to load guide:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-neutral-200 rounded w-64 mx-auto" />
          <div className="h-6 bg-neutral-200 rounded w-96 mx-auto" />
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-neutral-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!guide || guide.status === "generating" || guide.status === "pending_review") {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center pt-12">
        <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-brand-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-neutral-900 mb-3">
          {guide ? "Your guide is being reviewed" : "No guide found"}
        </h1>
        <p className="text-neutral-600 mb-6">
          {guide
            ? "Our stylist is reviewing your personalized guide. We'll email you when it's ready."
            : "Complete your assessment and purchase to receive your personalized style guide."}
        </p>
        <Button onClick={() => router.push("/dashboard")} variant="outline">
          Go to Dashboard
        </Button>
      </div>
    )
  }

  const content = guide.guideContent as StyleGuideContent | null

  if (!content) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center pt-12">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900 mb-3">
          Guide content unavailable
        </h1>
        <p className="text-neutral-600 mb-6">
          Something went wrong loading your guide content. Please contact support.
        </p>
        <Button onClick={() => router.push("/dashboard")} variant="outline">
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-brand-600 mb-4">
          Your Personalized Style Guide
        </p>
        {profileSummary && (
          <>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-neutral-900 mb-3">
              {profileSummary.styleArchetype}
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              {profileSummary.aestheticDescription}
            </p>
          </>
        )}
      </div>

      {/* Category Navigation */}
      <div className="sticky top-16 z-30 bg-brand-50/95 backdrop-blur-sm pb-4 pt-2 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {content.sections.map((section) => (
            <button
              key={section.category}
              onClick={() => setActiveCategory(section.category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === section.category
                  ? "bg-neutral-900 text-white"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300"
              }`}
            >
              {section.category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Recommendations by Category */}
      {content.sections.map((section) => (
        <div
          key={section.category}
          className={activeCategory === section.category ? "block" : "hidden"}
        >
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-2">
              {section.category}
            </h2>
            <p className="text-sm text-neutral-500">
              {section.items.length} recommended {section.items.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {section.items.map((item, idx) => (
              <div
                key={`${item.brand}-${item.name}-${idx}`}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden group hover:border-neutral-300 transition-colors"
              >
                {/* Product image placeholder */}
                <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
                  <div className="text-center px-6">
                    <p className="text-xs font-medium tracking-[0.15em] uppercase text-neutral-400 mb-1">
                      {item.brand}
                    </p>
                    <p className="text-sm font-medium text-neutral-600">
                      {item.name}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs font-medium text-brand-600 uppercase tracking-wider">
                        {item.brand}
                      </p>
                      <h3 className="font-medium text-neutral-900 text-sm mt-0.5">
                        {item.name}
                      </h3>
                    </div>
                    <span className="text-sm font-medium text-neutral-500 whitespace-nowrap">
                      {item.priceRange}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Expert reasoning */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-50 border border-brand-100 mb-4">
                    <svg
                      className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <p className="text-xs text-brand-800 leading-relaxed italic">
                      {item.reasoning}
                    </p>
                  </div>

                  <a
                    href={item.affiliateUrl || item.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Shop Now
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Lookbooks */}
      {content.lookbooks.length > 0 && (
        <section className="mt-16 mb-12">
          <div className="text-center mb-10">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-brand-600 mb-3">
              Lookbooks
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-neutral-900">
              How to Put It Together
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {content.lookbooks.map((lookbook, idx) => (
              <div
                key={`${lookbook.name}-${idx}`}
                className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8"
              >
                <h3 className="font-serif text-lg font-semibold text-neutral-900 mb-2">
                  {lookbook.name}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  {lookbook.description}
                </p>
                <div className="space-y-2">
                  {lookbook.items.map((item, i) => (
                    <div
                      key={`${item}-${i}`}
                      className="flex items-center gap-2 text-sm text-neutral-700"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* General Tips */}
      {content.generalTips.length > 0 && (
        <section className="mt-16 mb-12">
          <div className="bg-neutral-900 text-white rounded-2xl p-8 sm:p-10">
            <h2 className="font-serif text-2xl font-semibold mb-6">
              Expert Tips for You
            </h2>
            <div className="space-y-4">
              {content.generalTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-medium flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-neutral-300 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Feedback CTA */}
      <section className="mt-12 mb-4 text-center">
        <div className="bg-white rounded-2xl border border-neutral-200 p-8">
          <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-2">
            How did we do?
          </h3>
          <p className="text-sm text-neutral-600 mb-6">
            Your feedback helps us refine our recommendations and serve you better.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              if (guide) {
                window.location.href = `/guide/feedback?guideId=${guide.id}`
              }
            }}
          >
            Share Feedback
          </Button>
        </div>
      </section>
    </div>
  )
}