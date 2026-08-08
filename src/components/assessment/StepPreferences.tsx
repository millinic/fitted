"use client"

import { MultiSelectCard } from "@/components/ui/MultiSelectCard"
import { COLOR_FAMILIES, WARDROBE_GAP_OPTIONS } from "@/lib/constants"
import type { AssessmentFormData } from "@/types"

interface StepPreferencesProps {
  data: AssessmentFormData
  onChange: (data: Partial<AssessmentFormData>) => void
}

export function StepPreferences({ data, onChange }: StepPreferencesProps) {
  const colorPreferences = data.colorPreferences || []
  const wardrobeGaps = data.wardrobeGaps || []

  function toggleColor(value: string) {
    const updated = colorPreferences.includes(value)
      ? colorPreferences.filter((c) => c !== value)
      : [...colorPreferences, value]
    onChange({ colorPreferences: updated })
  }

  function toggleGap(value: string) {
    const updated = wardrobeGaps.includes(value)
      ? wardrobeGaps.filter((g) => g !== value)
      : [...wardrobeGaps, value]
    onChange({ wardrobeGaps: updated })
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-brand-700 mb-3">
          Color families you gravitate towards
        </p>
        <div className="flex flex-wrap gap-2">
          {COLOR_FAMILIES.map((color) => (
            <MultiSelectCard
              key={color.value}
              label={color.label}
              selected={colorPreferences.includes(color.value)}
              onClick={() => toggleColor(color.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-700 mb-3">
          Where does your wardrobe need the most work?
        </p>
        <div className="flex flex-wrap gap-2">
          {WARDROBE_GAP_OPTIONS.map((gap) => (
            <MultiSelectCard
              key={gap.value}
              label={gap.label}
              selected={wardrobeGaps.includes(gap.value)}
              onClick={() => toggleGap(gap.value)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}