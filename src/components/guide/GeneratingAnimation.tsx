"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { GUIDE_DELIVERY_MESSAGE } from "@/lib/constants"

const GENERATION_STEPS = [
  { label: "Analyzing your style profile", duration: 3000 },
  { label: "Matching body type & fit preferences", duration: 4000 },
  { label: "Curating brand recommendations", duration: 5000 },
  { label: "Building your color palette", duration: 4000 },
  { label: "Selecting specific products", duration: 6000 },
  { label: "Creating outfit combinations", duration: 5000 },
  { label: "Writing personalized styling advice", duration: 5000 },
  { label: "Finalizing your guide", duration: 4000 },
]

export function GeneratingAnimation() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const assessmentId = searchParams.get("assessment_id")
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [complete, setComplete] = useState(false)
  const hasTriggered = useRef(false)

  // Trigger guide generation on mount
  useEffect(() => {
    if (!assessmentId || hasTriggered.current) return
    hasTriggered.current = true

    fetch("/api/guide/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessmentId }),
    }).catch(console.error)
  }, [assessmentId])

  // Animation progression
  useEffect(() => {
    if (currentStepIdx >= GENERATION_STEPS.length) {
      setComplete(true)
      return
    }

    const timer = setTimeout(() => {
      setCurrentStepIdx((prev) => prev + 1)
    }, GENERATION_STEPS[currentStepIdx].duration)

    return () => clearTimeout(timer)
  }, [currentStepIdx])

  const handleViewGuide = () => {
    if (assessmentId) {
      router.push(`/guide/${assessmentId}`)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {!complete ? (
          <>
            <div className="mb-10 flex justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-brand-200" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-neutral-900 animate-spin" />
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 mb-4">
              Crafting your style guide
            </h2>

            <p className="text-neutral-500 mb-8 text-sm">
              This takes about 45 seconds. We&apos;re building something personalized, not generic.
            </p>

            <div className="space-y-3 mb-8 text-left max-w-sm mx-auto">
              {GENERATION_STEPS.map((step, idx) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                    idx < currentStepIdx
                      ? "text-success"
                      : idx === currentStepIdx
                        ? "text-neutral-900 font-medium"
                        : "text-neutral-300"
                  }`}
                >
                  {idx < currentStepIdx ? (
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : idx === currentStepIdx ? (
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-neutral-900 rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-neutral-300 rounded-full" />
                    </div>
                  )}
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 mb-4">
              Your guide is ready for review
            </h2>

            <p className="text-neutral-600 mb-2 leading-relaxed">
              {GUIDE_DELIVERY_MESSAGE}
            </p>

            <p className="text-sm text-neutral-500 mb-8">
              We&apos;ll notify you once your guide has been reviewed and approved. You can check the status anytime.
            </p>

            <button
              onClick={handleViewGuide}
              className="inline-flex items-center justify-center bg-neutral-900 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              View Guide Status
            </button>
          </>
        )}
      </div>
    </div>
  )
}