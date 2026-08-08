"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { GUIDE_PRICE_DISPLAY } from "@/lib/constants"
import type { StyleProfileSummary } from "@/lib/db/schema"

interface ProfileViewProps {
  assessmentId: string
  userId: string
  existingProfile?: {
    id: string
    summary: StyleProfileSummary | null
  }
}

export function ProfileView({ assessmentId, userId, existingProfile }: ProfileViewProps) {
  const [loading, setLoading] = useState(!existingProfile)
  const [summary, setSummary] = useState<StyleProfileSummary | null>(
    existingProfile?.summary ?? null
  )
  const [error, setError] = useState<string | null>(null)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    if (!existingProfile) {
      generateProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function generateProfile() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/profile/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId }),
      })

      if (!res.ok) {
        throw new Error("Failed to generate profile")
      }

      const result = await res.json()
      setSummary(result.data.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handlePurchase() {
    setPurchasing(true)
    setError(null)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, userId }),
      })

      if (!res.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout")
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-brand-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-brand-950 rounded-full border-t-transparent animate-spin" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-950 mb-2">
            Analyzing your style profile...
          </h2>
          <p className="text-brand-600">
            Our AI is crafting a personalized assessment based on your responses.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-brand-950 mb-2">Something went wrong</h2>
        <p className="text-brand-600 mb-6">{error}</p>
        <Button onClick={generateProfile}>Try Again</Button>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-medium tracking-widest uppercase text-accent-600 mb-3">
          Your Style Profile
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 mb-3">
          {summary.headline}
        </h1>
        <div className="inline-block px-4 py-1.5 bg-brand-950 text-brand-50 rounded-full text-sm font-medium">
          {summary.styleArchetype}
        </div>
      </div>

      {/* Key Insights */}
      <Card className="mb-6">
        <h3 className="font-serif text-lg font-semibold text-brand-950 mb-4">Key Insights</h3>
        <ul className="space-y-3">
          {summary.keyInsights.map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-brand-700">{insight}</p>
            </li>
          ))}
        </ul>
      </Card>

      {/* Fit Summary */}
      <Card className="mb-6">
        <h3 className="font-serif text-lg font-semibold text-brand-950 mb-3">Your Ideal Fit</h3>
        <p className="text-brand-700 leading-relaxed">{summary.fitSummary}</p>
      </Card>

      {/* Color Palette */}
      <Card className="mb-6">
        <h3 className="font-serif text-lg font-semibold text-brand-950 mb-4">
          Your Color Palette
        </h3>
        <div className="flex flex-wrap gap-2">
          {summary.colorPalette.map((color) => (
            <span
              key={color}
              className="px-3 py-1.5 bg-brand-100 text-brand-800 rounded-full text-sm"
            >
              {color}
            </span>
          ))}
        </div>
      </Card>

      {/* Brand Affinities */}
      <Card className="mb-10">
        <h3 className="font-serif text-lg font-semibold text-brand-950 mb-4">
          Brands We&apos;d Recommend
        </h3>
        <div className="flex flex-wrap gap-2">
          {summary.brandAffinities.map((brand) => (
            <span
              key={brand}
              className="px-3 py-1.5 bg-accent-100 text-accent-800 rounded-full text-sm font-medium"
            >
              {brand}
            </span>
          ))}
        </div>
      </Card>

      {/* Paywall CTA */}
      <div className="bg-brand-950 text-brand-50 rounded-2xl p-8 sm:p-10 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
          Unlock Your Full Style Guide
        </h2>
        <p className="text-brand-300 mb-6 max-w-lg mx-auto">
          Get specific product recommendations with purchase links, styling references,
          and expert reasoning — all personalized to you and reviewed by our stylist.
        </p>
        <div className="mb-6">
          <span className="text-4xl font-serif font-bold">{GUIDE_PRICE_DISPLAY}</span>
          <span className="text-brand-400 ml-2">one-time</span>
        </div>
        <ul className="text-sm text-brand-300 space-y-2 mb-8 max-w-sm mx-auto text-left">
          {[
            "Specific product recommendations with links",
            "Styling lookbooks and outfit combinations",
            "Expert reasoning for every item",
            "Human-reviewed by our stylist",
            "Delivered within 1–3 business days",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
        <Button
          variant="secondary"
          size="lg"
          className="bg-brand-50 text-brand-950 hover:bg-brand-200"
          onClick={handlePurchase}
          loading={purchasing}
        >
          Get My Style Guide — {GUIDE_PRICE_DISPLAY}
        </Button>
      </div>
    </div>
  )
}