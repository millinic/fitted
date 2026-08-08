"use client"

import { MultiSelect } from "@/components/ui/MultiSelect"
import { LIFESTYLE_CONTEXTS, STYLE_GOALS } from "@/lib/constants"
import type { AssessmentFormData } from "@/types"

interface Props {
  data: AssessmentFormData
  onChange: (updates: Partial<AssessmentFormData>) => void
}

export function LifestyleStep({ data, onChange }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-2">
          Lifestyle & Goals
        </h2>
        <p className="text-sm text-neutral-500">
          Understanding where you spend your time and what you&apos;re aiming
          for helps us prioritize the right pieces.
        </p>
      </div>

      <MultiSelect
        label="What situations are you primarily dressing for?"
        options={LIFESTYLE_CONTEXTS}
        selected={data.lifestyleContext}
        onChange={(selected) => onChange({ lifestyleContext: selected })}
      />

      <MultiSelect
        label="What are your style goals?"
        options={STYLE_GOALS}
        selected={data.styleGoals}
        onChange={(selected) => onChange({ styleGoals: selected })}
        maxSelections={3}
      />
    </div>
  )
}