"use client"

import type { AssessmentFormData } from "@/types"
import { MultiSelect } from "@/components/ui/MultiSelect"

interface StepProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
}

const COLOR_OPTIONS = [
  "Black",
  "White",
  "Navy",
  "Grey",
  "Charcoal",
  "Cream / Off-white",
  "Olive / Army Green",
  "Burgundy",
  "Tan / Camel",
  "Brown",
  "Light Blue",
  "Sage Green",
  "Terracotta",
  "Dusty Pink",
  "Lavender",
  "Mustard",
]

export function ColorsStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-neutral-900 mb-2">Color preferences</h2>
        <p className="text-neutral-500">
          Colors you&apos;re drawn to and ones you&apos;d rather avoid.
        </p>
      </div>

      <MultiSelect
        label="Colors you like wearing"
        options={COLOR_OPTIONS}
        selected={formData.colorPreferences}
        onChange={(selected) => updateFormData({ colorPreferences: selected })}
        columns={3}
      />

      <MultiSelect
        label="Colors you'd rather avoid"
        options={COLOR_OPTIONS}
        selected={formData.colorsToAvoid}
        onChange={(selected) => updateFormData({ colorsToAvoid: selected })}
        columns={3}
      />
    </div>
  )
}