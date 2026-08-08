"use client"

import { SelectionCard } from "@/components/ui/SelectionCard"
import { BUDGET_RANGES } from "@/lib/constants"
import type { AssessmentFormData } from "@/types"

interface StepBudgetProps {
  data: AssessmentFormData
  onChange: (data: Partial<AssessmentFormData>) => void
}

export function StepBudget({ data, onChange }: StepBudgetProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-brand-700 mb-3">
          What&apos;s your typical budget per item?
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {BUDGET_RANGES.map((range) => (
            <SelectionCard
              key={range.value}
              label={range.label}
              selected={data.budgetRange === range.value}
              onClick={() => onChange({ budgetRange: range.value })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-700 mb-3">
          How do you typically shop?
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { value: "online_only", label: "Mostly online" },
            { value: "in_store", label: "Mostly in-store" },
            { value: "both", label: "Mix of both" },
            { value: "rarely", label: "I rarely shop" },
          ].map((behavior) => (
            <SelectionCard
              key={behavior.value}
              label={behavior.label}
              selected={data.shoppingBehavior === behavior.value}
              onClick={() => onChange({ shoppingBehavior: behavior.value })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}