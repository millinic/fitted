"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { submitGuideFeedback } from "@/actions/guide"
import { Button } from "@/components/ui/Button"

export function FeedbackForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const guideId = searchParams.get("guideId")
  const [overallRating, setOverallRating] = useState(0)
  const [personalizedFeeling, setPersonalizedFeeling] = useState(0)
  const [wouldRefer, setWouldRefer] = useState<boolean | null>(null)
  const [freeformFeedback, setFreeformFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!guideId) {
      setError("Guide not found.")
      return
    }
    if (overallRating === 0 || personalizedFeeling === 0 || wouldRefer === null) {
      setError("Please answer all required questions.")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const result = await submitGuideFeedback({
        guideId,
        overallRating,
        personalizedFeeling,
        wouldRefer,
        flaggedItems: [],
        freeformFeedback,
      })

      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error || "Failed to submit feedback.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center pt-12">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-neutral-900 mb-3">
          Thank you for your feedback
        </h1>
        <p className="text-neutral-600 mb-6">
          Your feedback helps us continuously improve. We appreciate you taking the time.
        </p>
        <Button onClick={() => router.push("/guide")} variant="outline">
          Back to Guide
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-neutral-900 mb-2">
          Share Your Feedback
        </h1>
        <p className="text-sm text-neutral-500">
          Help us understand how well we did and where we can improve.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-8">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            How would you rate your overall guide experience?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setOverallRating(n)}
                className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                  overallRating >= n
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-1">1 = Poor, 5 = Excellent</p>
        </div>

        {/* Personalized Feeling */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            How personalized did the guide feel?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPersonalizedFeeling(n)}
                className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                  personalizedFeeling >= n
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            1 = Very generic, 5 = Made just for me
          </p>
        </div>

        {/* Would Refer */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Would you recommend Fitted to a friend?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setWouldRefer(true)}
              className={`flex-1 h-11 rounded-lg border text-sm font-medium transition-colors ${
                wouldRefer === true
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setWouldRefer(false)}
              className={`flex-1 h-11 rounded-lg border text-sm font-medium transition-colors ${
                wouldRefer === false
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              Not yet
            </button>
          </div>
        </div>

        {/* Freeform */}
        <div>
          <label
            htmlFor="freeform"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            Anything else you&apos;d like to share?{" "}
            <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="freeform"
            rows={4}
            value={freeformFeedback}
            onChange={(e) => setFreeformFeedback(e.target.value)}
            placeholder="What worked well? What could be better? Any specific items you loved or didn't love?"
            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          loading={submitting}
          className="w-full"
        >
          Submit Feedback
        </Button>
      </div>
    </div>
  )
}