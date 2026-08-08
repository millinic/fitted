"use client"

import { MultiSelectCard } from "@/components/ui/MultiSelectCard"
import { LIFESTYLE_CONTEXTS } from "@/lib/constants"
import type { AssessmentFormData } from "@/types"

interface StepLifestyleProps {
  data: AssessmentFormData
  onChange: (data: Partial<AssessmentFormData>) => void
}

export function StepLifestyle({ data, onChange }: StepLifestyleProps) {
  const selected = data.lifestyleContext || []

  function toggleContext(value: string) {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange({ lifestyleContext: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-700 mb-3">
          What contexts do you dress for most often? (Select all that apply)
        </p>
        <div className="flex flex-wrap gap-2">
          {LIFESTYLE_CONTEXTS.map((ctx) => (
            <MultiSelectCard
              key={ctx.value}
              label={ctx.label}
              selected={selected.includes(ctx.value)}
              onClick={() => toggleContext(ctx.value)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}