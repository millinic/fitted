"use client"

import type { AssessmentFormData } from "@/types"
import { MultiSelect } from "@/components/ui/MultiSelect"
import { RadioGroup } from "@/components/ui/RadioGroup"
import { LIFESTYLE_CONTEXTS, STYLE_GOALS } from "@/lib/constants"

interface StepProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
}

export function LifestyleStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-neutral-900 mb-2">Your lifestyle</h2>
        <p className="text-neutral-500">
          We want to recommend clothes for your actual life, not an imaginary one.
        </p>
      </div>

      <MultiSelect
        label="What situations are you primarily dressing for? (Select all that apply)"
        options={LIFESTYLE_CONTEXTS}
        selected={formData.lifestyleContext}
        onChange={(selected) => updateFormData({ lifestyleContext: selected })}
      />

      <RadioGroup
        label="What's your primary style goal?"
        options={STYLE_GOALS.map((g) => ({ value: g, label: g }))}
        value={formData.styleGoal}
        onChange={(v) => updateFormData({ styleGoal: v })}
      />
    </div>
  )
}