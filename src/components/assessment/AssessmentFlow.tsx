"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Button } from "@/components/ui/Button"
import { StepMeasurements } from "./StepMeasurements"
import { StepBodyFit } from "./StepBodyFit"
import { StepLifestyle } from "./StepLifestyle"
import { StepGoals } from "./StepGoals"
import { StepBrands } from "./StepBrands"
import { StepPreferences } from "./StepPreferences"
import { StepBudget } from "./StepBudget"
import { StepReferences } from "./StepReferences"
import { ASSESSMENT_STEPS } from "@/lib/assessment-steps"
import type { AssessmentFormData } from "@/types"

interface AssessmentFlowProps {
  userId: string
  existingData?: AssessmentFormData
  assessmentId?: string
}

export function AssessmentFlow({ userId, existingData, assessmentId }: AssessmentFlowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<AssessmentFormData>(existingData || {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const step = ASSESSMENT_STEPS[currentStep]
  const isLastStep = currentStep === ASSESSMENT_STEPS.length - 1

  const updateData = useCallback((partial: Partial<AssessmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }))
  }, [])

  async function handleNext() {
    if (isLastStep) {
      await handleSubmit()
    } else {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  async function handleSubmit() {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/assessment", {
        method: assessmentId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          assessmentId,
          data: formData,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to save assessment")
      }

      const result = await res.json()
      router.push(`/profile/${result.data.assessmentId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  function renderStep() {
    switch (step.id) {
      case "measurements":
        return <StepMeasurements data={formData} onChange={updateData} />
      case "body_fit":
        return <StepBodyFit data={formData} onChange={updateData} />
      case "lifestyle":
        return <StepLifestyle data={formData} onChange={updateData} />
      case "goals":
        return <StepGoals data={formData} onChange={updateData} />
      case "brands":
        return <StepBrands data={formData} onChange={updateData} />
      case "preferences":
        return <StepPreferences data={formData} onChange={updateData} />
      case "budget":
        return <StepBudget data={formData} onChange={updateData} />
      case "references":
        return <StepReferences data={formData} onChange={updateData} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar
        current={currentStep + 1}
        total={ASSESSMENT_STEPS.length}
        className="mb-8"
      />

      <div className="mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 mb-2">
          {step.title}
        </h2>
        <p className="text-brand-600">{step.description}</p>
      </div>

      <div className="mb-8">{renderStep()}</div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          loading={saving}
        >
          {isLastStep ? "Complete Assessment" : "Continue"}
        </Button>
      </div>
    </div>
  )
}