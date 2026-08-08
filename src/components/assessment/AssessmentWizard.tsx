"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { AssessmentFormData } from "@/types"
import { ASSESSMENT_STEPS } from "@/lib/constants"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Button } from "@/components/ui/Button"
import { BasicsStep } from "./steps/BasicsStep"
import { MeasurementsStep } from "./steps/MeasurementsStep"
import { BodyFitStep } from "./steps/BodyFitStep"
import { LifestyleStep } from "./steps/LifestyleStep"
import { StylePreferencesStep } from "./steps/StylePreferencesStep"
import { BrandsStep } from "./steps/BrandsStep"
import { ColorsStep } from "./steps/ColorsStep"
import { BudgetStep } from "./steps/BudgetStep"
import { FinalStep } from "./steps/FinalStep"

const initialFormData: AssessmentFormData = {
  firstName: "",
  lastName: "",
  age: null,
  location: "",
  heightFeet: null,
  heightInches: null,
  waist: null,
  chest: null,
  inseam: null,
  shoeSize: "",
  typicalTopSize: "",
  typicalBottomSize: "",
  bodyType: null,
  fitPreference: null,
  brandFitReferences: [],
  lifestyleContext: [],
  lifestyleFrequency: {},
  styleGoal: "",
  brandsLiked: [],
  styleReferences: [],
  colorPreferences: [],
  colorsToAvoid: [],
  wardrobeGaps: [],
  budgetRange: null,
  monthlyBudget: null,
  shoppingBehavior: "",
  additionalNotes: "",
}

export function AssessmentWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<AssessmentFormData>(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateFormData = useCallback((updates: Partial<AssessmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  const canProceed = (): boolean => {
    switch (ASSESSMENT_STEPS[currentStep]) {
      case "basics":
        return formData.firstName.trim().length > 0
      case "measurements":
        return formData.heightFeet !== null && formData.heightInches !== null
      case "body-fit":
        return formData.bodyType !== null && formData.fitPreference !== null
      case "lifestyle":
        return formData.lifestyleContext.length > 0 && formData.styleGoal.length > 0
      case "style-preferences":
        return true
      case "brands":
        return true
      case "colors":
        return formData.colorPreferences.length > 0
      case "budget":
        return formData.budgetRange !== null
      case "final":
        return true
      default:
        return true
    }
  }

  const goNext = () => {
    if (currentStep < ASSESSMENT_STEPS.length - 1 && canProceed()) {
      setCurrentStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit assessment")
      }

      router.push(`/profile/${data.data.assessmentId}`)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  const stepProps = { formData, updateFormData }

  const renderStep = () => {
    switch (ASSESSMENT_STEPS[currentStep]) {
      case "basics":
        return <BasicsStep {...stepProps} />
      case "measurements":
        return <MeasurementsStep {...stepProps} />
      case "body-fit":
        return <BodyFitStep {...stepProps} />
      case "lifestyle":
        return <LifestyleStep {...stepProps} />
      case "style-preferences":
        return <StylePreferencesStep {...stepProps} />
      case "brands":
        return <BrandsStep {...stepProps} />
      case "colors":
        return <ColorsStep {...stepProps} />
      case "budget":
        return <BudgetStep {...stepProps} />
      case "final":
        return <FinalStep {...stepProps} />
      default:
        return null
    }
  }

  const isLastStep = currentStep === ASSESSMENT_STEPS.length - 1

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <ProgressBar currentStep={currentStep} totalSteps={ASSESSMENT_STEPS.length} className="mb-8" />

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-brand-100 min-h-[400px]">
          {renderStep()}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-error">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={goBack} disabled={currentStep === 0}>
            ← Back
          </Button>

          {isLastStep ? (
            <Button onClick={handleSubmit} loading={submitting} size="lg" disabled={!canProceed()}>
              See My Style Profile
            </Button>
          ) : (
            <Button onClick={goNext} disabled={!canProceed()}>
              Continue →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}