"use client"

import { MultiSelect } from "@/components/ui/MultiSelect"
import { SelectableCard } from "@/components/ui/SelectableCard"
import { WARDROBE_CATEGORIES, BUDGET_RANGES } from "@/lib/constants"
import type { AssessmentFormData, BudgetRange } from "@/types"

interface Props {
  data: AssessmentFormData
  onChange: (updates: Partial<AssessmentFormData>) => void
}

export function WardrobeBudgetStep({ data, onChange }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-2">
          Wardrobe & Budget
        </h2>
        <p className="text-sm text-neutral-500">
          Almost done. Tell us where the gaps are and what you&apos;re
          comfortable spending.
        </p>
      </div>

      <MultiSelect
        label="Where are the biggest gaps in your wardrobe?"
        options={WARDROBE_CATEGORIES}
        selected={data.wardrobeGaps}
        onChange={(selected) => onChange({ wardrobeGaps: selected })}
      />

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          What&apos;s your budget per piece?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BUDGET_RANGES.map((range) => (
            <SelectableCard
              key={range.value}
              label={range.label}
              description={range.description}
              selected={data.budgetRange === range.value}
              onClick={() =>
                onChange({ budgetRange: range.value as BudgetRange })
              }
            />
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="shoppingBehavior"
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          How do you typically shop?
        </label>
        <textarea
          id="shoppingBehavior"
          rows={3}
          value={data.shoppingBehavior}
          onChange={(e) => onChange({ shoppingBehavior: e.target.value })}
          placeholder="e.g., I buy things when I need them, rarely browse online, prefer in-store..."
          className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="additionalNotes"
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          Anything else we should know?{" "}
          <span className="text-neutral-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="additionalNotes"
          rows={3}
          value={data.additionalNotes}
          onChange={(e) => onChange({ additionalNotes: e.target.value })}
          placeholder="Any specific style challenges, upcoming events, or preferences..."
          className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  )
}