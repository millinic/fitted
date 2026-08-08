"use client"

import type { AssessmentFormData } from "@/types"
import { RadioGroup } from "@/components/ui/RadioGroup"
import { Input } from "@/components/ui/Input"
import { BUDGET_RANGES } from "@/lib/constants"

interface StepProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
}

const SHOPPING_BEHAVIORS = [
  { value: "rarely", label: "Rarely", description: "A few times a year, when I need something" },
  { value: "occasionally", label: "Occasionally", description: "Every couple of months" },
  { value: "regularly", label: "Regularly", description: "Monthly, I enjoy finding new pieces" },
  { value: "overhaul", label: "Ready for an overhaul", description: "I want to rebuild my wardrobe from scratch" },
]

export function BudgetStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-neutral-900 mb-2">Budget & shopping</h2>
        <p className="text-neutral-500">
          We&apos;ll tailor recommendations to brands and price points that work for you.
        </p>
      </div>

      <RadioGroup
        label="What's your typical budget per piece?"
        options={BUDGET_RANGES.map((b) => ({
          value: b.value,
          label: b.label,
          description: b.description,
        }))}
        value={formData.budgetRange}
        onChange={(v) => updateFormData({ budgetRange: v as any })}
      />

      <Input
        label="Approximate monthly clothing budget (optional)"
        type="number"
        value={formData.monthlyBudget ?? ""}
        onChange={(e) => updateFormData({ monthlyBudget: e.target.value ? parseInt(e.target.value) : null })}
        placeholder="e.g. 500"
        hint="In USD — helps us prioritize recommendations"
      />

      <RadioGroup
        label="How would you describe your shopping behavior?"
        options={SHOPPING_BEHAVIORS}
        value={formData.shoppingBehavior}
        onChange={(v) => updateFormData({ shoppingBehavior: v })}
      />
    </div>
  )
}