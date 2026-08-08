"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { GUIDE_GENERATION_ANIMATION_SECONDS } from "@/lib/constants"

function GeneratingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const assessmentId = searchParams.get("assessment_id")
  const [progress, setProgress] = useState(0)
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [triggered, setTriggered] = useState(false)

  const phrases = [
    "Analyzing your style profile...",
    "Mapping your color palette...",
    "Curating brand recommendations...",
    "Selecting product matches...",
    "Building your lookbook...",
    "Applying expert styling notes...",
    "Finalizing your guide...",
  ]

  const triggerGeneration = useCallback(async () => {
    if (!sessionId || !assessmentId || triggered) return
    setTriggered(true)

    try {
      await fetch("/api/guide/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, assessmentId }),
      })
    } catch (error) {
      console.error("Guide generation trigger error:", error)
    }
  }, [sessionId, assessmentId, triggered])

  useEffect(() => {
    triggerGeneration()
  }, [triggerGeneration])

  useEffect(() => {
    const duration = GUIDE_GENERATION_ANIMATION_SECONDS * 1000
    const interval = 100
    const steps = duration / interval

    let step = 0
    const timer = setInterval(() => {
      step++
      const newProgress = Math.min((step / steps) * 100, 100)
      setProgress(newProgress)

      const phraseIndex = Math.min(
        Math.floor((step / steps) * phrases.length),
        phrases.length - 1
      )
      setCurrentPhrase(phraseIndex)

      if (step >= steps) {
        clearInterval(timer)
        router.push("/guide/pending")
      }
    }, interval)

    return () => clearInterval(timer)
  }, [router, phrases.length])

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-8 relative">
            <div className="absolute inset-0 border-4 border-brand-200 rounded-full" />
            <div
              className="absolute inset-0 border-4 border-brand-950 rounded-full border-t-transparent animate-spin"
              style={{ animationDuration: "1.5s" }}
            />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 mb-4">
            Crafting Your Style Guide
          </h1>
          <p className="text-brand-600 mb-8 text-lg">{phrases[currentPhrase]}</p>
        </div>

        <div className="w-full h-2 bg-brand-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-brand-950 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-brand-500">{Math.round(progress)}% complete</p>
      </div>
    </main>
  )
}

export default function GeneratingPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <main className="min-h-[80vh] flex items-center justify-center">
            <div className="animate-pulse text-brand-500">Loading...</div>
          </main>
        }
      >
        <GeneratingContent />
      </Suspense>
      <Footer />
    </>
  )
}