"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Button } from "@/components/ui/Button"
import { MeasurementsStep } from "./MeasurementsStep"
import { BodyFitStep } from "./BodyFitStep"
import { LifestyleStep } from "./LifestyleStep"
import { StylePreferencesStep } from "./StylePreferencesStep"
import { BrandsReferencesStep } from "./BrandsReferencesStep"
import { WardrobeBudgetStep } from "./WardrobeBudgetStep"
import { saveAssessment } from "@/actions/assessment"
import { ASSESSMENT_STEPS } from "@/lib/constants"
import type { AssessmentFormData } from "@/types"

const initialFormData: AssessmentFormData = {
  waistSize: "",
  chestSize: "",
  inseam: "",
  typicalShirtSize: "",
  typicalPantSize: "",
  shoeSize: "",
  height: "",
  bodyType: "",
  fitPreference: "",
  brandFitReferences: [],
  lifestyleContext: [],
  lifestyleFrequency: {},
  styleGoals: [],
  brandsLiked: [],
  styleReferences: [],
  colorPreferences: [],
  colorsToAvoid: [],
  wardrobeGaps: [],
  budgetRange: "",
  shoppingBehavior: "",
  additionalNotes: "",
}

export function AssessmentFlow() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<AssessmentFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateFormData = useCallback(
    (updates: Partial<AssessmentFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }))
    },
    []
  )

  const steps = [
    <MeasurementsStep
      key="measurements"
      data={formData}
      onChange={updateFormData}
    />,
    <BodyFitStep key="body-fit" data={formData} onChange={updateFormData} />,
    <LifestyleStep key="lifestyle" data={formData} onChange={updateFormData} />,
    <StylePreferencesStep
      key="style-prefs"
      data={formData}
      onChange={updateFormData}
    />,
    <BrandsReferencesStep
      key="brands"
      data={formData}
      onChange={updateFormData}
    />,
    <WardrobeBudgetStep
      key="wardrobe-budget"
      data={formData}
      onChange={updateFormData}
    />,
  ]

  const isLastStep = currentStep === steps.length - 1

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    if (status !== "authenticated") {
      // Store form data in sessionStorage before redirecting to sign in
      try {
        sessionStorage.setItem("assessmentFormData", JSON.stringify(formData))
      } catch {
        // sessionStorage might be unavailable
      }
      signIn("google", { callbackUrl: "/assessment" })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await saveAssessment(formData)

      if (result.success) {
        try {
          sessionStorage.setItem(
            "profileSummary",
            JSON.stringify(result.data.profileSummary)
          )
          sessionStorage.setItem("assessmentId", result.data.assessmentId)
        } catch {
          // sessionStorage might be unavailable
        }
        router.push(`/profile?assessmentId=${result.data.assessmentId}`)
      } else {
        setError(result.error)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Restore form data from sessionStorage on mount (after sign-in redirect)
  useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("assessmentFormData")
        if (saved) {
          const parsed = JSON.parse(saved)
          setFormData(parsed)
          sessionStorage.removeItem("assessmentFormData")
          // Go to last step
          setCurrentStep(steps.length - 1)
        }
      } catch {
        // ignore
      }
    }
  })

  return (
    <div className="min-h-screen bg-brand-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={ASSESSMENT_STEPS.length}
          className="mb-10"
        />

        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-10 shadow-sm">
          {steps[currentStep]}

          {error && (
            <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={currentStep === 0 ? "invisible" : ""}
            >
              ← Back
            </Button>

            {isLastStep ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                loading={isSubmitting}
              >
                {status !== "authenticated"
                  ? "Sign In & Generate Profile"
                  : isSubmitting
                    ? "Generating Your Profile..."
                    : "Generate My Style Profile"}
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                Continue →
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Your data is stored securely and never shared with third parties.
        </p>
      </div>
    </div>
  )
}