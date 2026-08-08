"use client"

import { useState } from "react"
import type { StyleProfileSummary } from "@/types"
import { GUIDE_PRICE_DISPLAY, GUIDE_DELIVERY_MESSAGE } from "@/lib/constants"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Footer } from "@/components/layout/Footer"

interface StyleProfileViewProps {
  assessmentId: string
  firstName: string
  profile: StyleProfileSummary
}

export function StyleProfileView({ assessmentId, firstName, profile }: StyleProfileViewProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      window.location.href = data.data.checkoutUrl
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
      setLoading(false)
    }
  }

  const COLOR_MAP: Record<string, string> = {
    "Black": "bg-neutral-900",
    "White": "bg-white border border-neutral-200",
    "Navy": "bg-blue-900",
    "Grey": "bg-neutral-400",
    "Charcoal": "bg-neutral-700",
    "Cream / Off-white": "bg-amber-50 border border-neutral-200",
    "Olive / Army Green": "bg-green-800",
    "Burgundy": "bg-red-900",
    "Tan / Camel": "bg-amber-200",
    "Brown": "bg-amber-800",
    "Light Blue": "bg-blue-300",
    "Sage Green": "bg-green-300",
    "Terracotta": "bg-orange-700",
    "Dusty Pink": "bg-pink-300",
    "Lavender": "bg-purple-300",
    "Mustard": "bg-yellow-600",
  }

  return (
    <>
      <div className="bg-brand-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-600 mb-3">
              Your Style Profile
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-neutral-900 mb-4">
              {profile.headline}
            </h1>
            <p className="text-lg text-neutral-600">
              Hey {firstName}, here&apos;s what we learned about your style.
            </p>
          </div>

          {/* Archetype Badge */}
          <div className="flex justify-center mb-10">
            <span className="px-6 py-2.5 bg-neutral-900 text-white rounded-full text-sm font-medium tracking-wide">
              {profile.archetype}
            </span>
          </div>

          {/* Summary */}
          <Card variant="elevated" className="mb-8">
            <div className="space-y-4">
              {profile.body.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-neutral-700 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </Card>

          {/* Key Traits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card variant="bordered">
              <h3 className="font-serif text-lg text-neutral-900 mb-4">Key Traits</h3>
              <div className="flex flex-wrap gap-2">
                {profile.keyTraits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1.5 bg-brand-100 text-brand-800 rounded-lg text-sm font-medium"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </Card>

            <Card variant="bordered">
              <h3 className="font-serif text-lg text-neutral-900 mb-4">Your Color Palette</h3>
              <div className="flex flex-wrap gap-2">
                {profile.colorPalette.map((color) => (
                  <div key={color} className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-lg">
                    <div className={`w-4 h-4 rounded-full shrink-0 ${COLOR_MAP[color] || "bg-neutral-300"}`} />
                    <span className="text-neutral-700 text-sm font-medium">{color}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Brand Preview */}
          <Card variant="bordered" className="mb-12">
            <h3 className="font-serif text-lg text-neutral-900 mb-4">Recommended Brands Preview</h3>
            <p className="text-sm text-neutral-500 mb-4">
              These brands align with your style profile. Your full guide will include specific product recommendations from these and similar brands.
            </p>
            <div className="flex flex-wrap gap-3">
              {profile.brandPreview.map((brand) => (
                <span
                  key={brand}
                  className="px-4 py-2 bg-brand-50 border border-brand-200 text-neutral-800 rounded-full text-sm font-medium"
                >
                  {brand}
                </span>
              ))}
            </div>
          </Card>

          {/* Paywall */}
          <Card variant="elevated" className="text-center border-2 border-brand-200">
            <div className="max-w-md mx-auto py-4">
              <h2 className="font-serif text-2xl text-neutral-900 mb-3">
                Get your full style guide
              </h2>
              <p className="text-neutral-600 mb-6">
                Unlock 15-20 specific product recommendations, complete outfit lookbooks, purchase
                links, and personalized styling advice — all reviewed by our founder stylist.
              </p>

              <ul className="text-left space-y-2 mb-6">
                {[
                  "Specific products with brand names & prices",
                  "4-5 complete outfit lookbooks",
                  "Personalized fit & styling advice",
                  "Reviewed by our founder stylist",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-neutral-600">
                    <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline justify-center gap-2 mb-6">
                <span className="text-4xl font-serif font-semibold text-neutral-900">
                  {GUIDE_PRICE_DISPLAY}
                </span>
                <span className="text-neutral-500">one-time</span>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error">
                  {error}
                </div>
              )}

              <Button size="lg" onClick={handlePurchase} loading={loading} className="w-full">
                Get My Full Style Guide
              </Button>

              <p className="text-xs text-neutral-400 mt-4">{GUIDE_DELIVERY_MESSAGE}</p>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}