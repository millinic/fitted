"use client"

import { SelectionCard } from "@/components/ui/SelectionCard"
import { STYLE_GOALS } from "@/lib/constants"
import type { AssessmentFormData } from "@/types"

interface StepGoalsProps {
  data: AssessmentFormData
  onChange: (data: Partial<AssessmentFormData>) => void
}

export function StepGoals({ data, onChange }: StepGoalsProps) {
  const selected = data.styleGoals || []

  function toggleGoal(value: string) {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange({ styleGoals: updated })
  }

  return (
    <div>
      <p className="text-sm font-medium text-brand-700 mb-3">
        What are you hoping to achieve? (Select all that apply)
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {STYLE_GOALS.map((goal) => (
          <SelectionCard
            key={goal.value}
            label={goal.label}
            selected={selected.includes(goal.value)}
            onClick={() => toggleGoal(goal.value)}
          />
        ))}
      </div>
    </div>
  )
}