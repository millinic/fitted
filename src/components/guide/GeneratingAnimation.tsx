"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyPaymentAndGenerateGuide } from "@/actions/payment"
import { GUIDE_GENERATION_ANIMATION_DURATION_MS } from "@/lib/constants"

const STAGES = [
  { label: "Verifying payment", duration: 3000 },
  { label: "Analyzing your style profile", duration: 6000 },
  { label: "Curating product recommendations", duration: 10000 },
  { label: "Building lookbook combinations", duration: 8000 },
  { label: "Applying expert styling principles", duration: 8000 },
  { label: "Finalizing your guide", duration: 10000 },
]

export function GeneratingAnimation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guideId, setGuideId] = useState<string | null>(null)

  const processPayment = useCallback(async () => {
    if (!sessionId) {
      setError("No session found. Please contact support.")
      return
    }

    try {
      const result = await verifyPaymentAndGenerateGuide(sessionId)
      if (result.success && result.data) {
        setGuideId(result.data.guideId)
      } else {
        setError(result.error || "Something went wrong")
      }
    } catch {
      setError("Failed to process your guide. Please contact support.")
    }
  }, [sessionId])

  useEffect(() => {
    processPayment()
  }, [processPayment])

  useEffect(() => {
    const totalDuration = GUIDE_GENERATION_ANIMATION_DURATION_MS
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(pct)

      let accumulated = 0
      for (let i = 0; i < STAGES.length; i++) {
        accumulated += STAGES[i].duration
        if (elapsed < accumulated) {
          setCurrentStage(i)
          break
        }
        if (i === STAGES.length - 1) {
          setCurrentStage(i)
        }
      }

      if (pct >= 100) {
        clearInterval(interval)
        setCompleted(true)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (completed && guideId) {
      const timer = setTimeout(() => {
        router.push("/guide/pending")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [completed, guideId, router])

  if (error) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-3">
            Something went wrong
          </h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-brand-700 hover:text-brand-900 underline underline-offset-4"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated progress circle */}
        <div className="relative w-20 h-20 mx-auto mb-10">
          <svg className="w-20 h-20" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#e5e5e5"
              strokeWidth="3"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#171717"
              strokeWidth="3"
              strokeDasharray={`${progress * 2.26} 226`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-neutral-900">
            {Math.round(progress)}%
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-neutral-900 mb-3">
          {completed ? "Guide Generated" : "Creating Your Guide"}
        </h2>

        <p className="text-neutral-500 mb-8 h-6 transition-opacity duration-500">
          {completed
            ? "Preparing for expert review..."
            : STAGES[currentStage]?.label}
        </p>

        {/* Stage progress */}
        <div className="space-y-2 max-w-sm mx-auto">
          {STAGES.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-3 text-left">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                  i < currentStage || completed
                    ? "bg-neutral-900"
                    : i === currentStage
                      ? "bg-brand-500"
                      : "bg-neutral-200"
                }`}
              >
                {(i < currentStage || completed) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm transition-colors duration-300 ${
                  i <= currentStage || completed
                    ? "text-neutral-700"
                    : "text-neutral-400"
                }`}
              >
                {stage.label}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-neutral-400">
          Please don&apos;t close this page
        </p>
      </div>
    </div>
  )
}