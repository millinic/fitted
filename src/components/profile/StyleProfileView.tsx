"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { getProfileSummary } from "@/actions/guide"
import { createCheckoutSession } from "@/actions/payment"
import { GUIDE_PRICE_DISPLAY, ESTIMATED_DELIVERY_DAYS } from "@/lib/constants"
import type { StyleProfileSummaryContent } from "@/types"

export function StyleProfileView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const assessmentId = searchParams.get("assessmentId")
  const [profile, setProfile] = useState<StyleProfileSummaryContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      // Try sessionStorage first for immediate display
      try {
        const cached = sessionStorage.getItem("profileSummary")
        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed && parsed.styleArchetype) {
            setProfile(parsed)
            setLoading(false)
            return
          }
        }
      } catch {
        // Fall through to API
      }

      if (!assessmentId) {
        setLoading(false)
        return
      }

      try {
        const result = await getProfileSummary(assessmentId)
        if (result.success && result.data?.profileSummary) {
          setProfile(result.data.profileSummary)
        }
      } catch {
        // Silently fail, show empty state
      }
      setLoading(false)
    }

    loadProfile()
  }, [assessmentId])

  const handlePurchase = async () => {
    if (!session) {
      signIn("google", { callbackUrl: window.location.href })
      return
    }

    let id = assessmentId
    if (!id) {
      try {
        id = sessionStorage.getItem("assessmentId")
      } catch {
        // ignore
      }
    }

    if (!id) {
      setError("Assessment not found. Please retake the assessment.")
      return
    }

    setPurchasing(true)
    setError(null)

    try {
      const result = await createCheckoutSession(id)
      if (result.success && result.data) {
        window.location.href = result.data.sessionUrl
      } else {
        setError(result.error || "Failed to start checkout")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-brand-50 pt-32 flex items-start justify-center">
          <div className="animate-pulse space-y-6 w-full max-w-2xl px-4">
            <div className="h-8 bg-neutral-200 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-neutral-200 rounded w-2/3 mx-auto" />
            <div className="h-64 bg-neutral-200 rounded-2xl" />
          </div>
        </div>
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-brand-50 pt-32 flex flex-col items-center justify-start px-4">
          <h1 className="font-serif text-2xl font-semibold text-neutral-900 mb-4">
            Profile Not Found
          </h1>
          <p className="text-neutral-600 mb-6">
            We couldn&apos;t find your style profile. Please complete the
            assessment first.
          </p>
          <Button onClick={() => router.push("/assessment")}>
            Start Assessment
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-brand-50 pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-brand-600 mb-4">
              Your Style Profile
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-neutral-900 mb-3">
              {profile.styleArchetype}
            </h1>
            <p className="text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
              {profile.aestheticDescription}
            </p>
          </div>

          {/* Profile Details */}
          <div className="space-y-8">
            {/* Key Principles */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8">
              <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-brand-600 mb-5">
                Your Style Principles
              </h3>
              <ul className="space-y-3">
                {profile.keyPrinciples.map((principle, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-neutral-700"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-medium flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {principle}
                  </li>
                ))}
              </ul>
            </div>

            {/* Color Palette & Fit */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8">
                <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-brand-600 mb-5">
                  Your Color Palette
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.colorPalette.map((color) => (
                    <span
                      key={color}
                      className="px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-sm text-brand-800"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8">
                <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-brand-600 mb-5">
                  Fit Guidance
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {profile.fitGuidance}
                </p>
              </div>
            </div>

            {/* Recommended Brands */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8">
              <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-brand-600 mb-5">
                Recommended Brands
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.recommendedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="px-4 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-sm font-medium text-neutral-700"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA / Paywall */}
          <div className="mt-12 bg-neutral-900 text-white rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-3">
              Ready for your full style guide?
            </h2>
            <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
              Get 20+ specific product recommendations with purchase links,
              lookbook combinations, and expert styling tips — all tailored to
              your{" "}
              <span className="text-white font-medium">
                {profile.styleArchetype}
              </span>{" "}
              profile.
            </p>

            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-neutral-300 text-left max-w-md mx-auto mb-8">
              {[
                "Specific product picks with links",
                "Lookbook styling combinations",
                "Expert reasoning per item",
                "Reviewed by our stylist",
                `Delivered in ${ESTIMATED_DELIVERY_DAYS}`,
                "One-time purchase",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-brand-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-900/30 border border-red-800 text-sm text-red-300">
                {error}
              </div>
            )}

            <Button
              variant="secondary"
              size="lg"
              onClick={handlePurchase}
              loading={purchasing}
              className="text-neutral-900 bg-white hover:bg-neutral-100"
            >
              Get My Full Guide — {GUIDE_PRICE_DISPLAY}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}