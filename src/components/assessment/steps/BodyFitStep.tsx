"use client"

import type { AssessmentFormData } from "@/types"
import { RadioGroup } from "@/components/ui/RadioGroup"
import { BODY_TYPES, FIT_PREFERENCES } from "@/lib/constants"

interface StepProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
}

export function BodyFitStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-neutral-900 mb-2">Body type & fit preference</h2>
        <p className="text-neutral-500">
          This helps us recommend pieces that work with your proportions and match how you like
          your clothes to feel.
        </p>
      </div>

      <RadioGroup
        label="Which best describes your body type?"
        options={BODY_TYPES.map((bt) => ({ value: bt.value, label: bt.label }))}
        value={formData.bodyType}
        onChange={(v) => updateFormData({ bodyType: v as any })}
        columns={2}
      />

      <RadioGroup
        label="How do you prefer your clothes to fit?"
        options={FIT_PREFERENCES.map((fp) => ({
          value: fp.value,
          label: fp.label,
          description: fp.description,
        }))}
        value={formData.fitPreference}
        onChange={(v) => updateFormData({ fitPreference: v as any })}
      />
    </div>
  )
}