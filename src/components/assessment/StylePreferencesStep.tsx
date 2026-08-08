"use client"

import { TagInput } from "@/components/ui/TagInput"
import type { AssessmentFormData } from "@/types"

const COLOR_OPTIONS = [
  "Navy",
  "Black",
  "White",
  "Grey",
  "Olive",
  "Tan/Khaki",
  "Burgundy",
  "Brown",
  "Cream",
  "Blue",
  "Green",
  "Charcoal",
  "Camel",
  "Stone",
  "Rust",
] as const

interface Props {
  data: AssessmentFormData
  onChange: (updates: Partial<AssessmentFormData>) => void
}

export function StylePreferencesStep({ data, onChange }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-2">
          Style & Color Preferences
        </h2>
        <p className="text-sm text-neutral-500">
          Tell us about the colors you gravitate toward and any you&apos;d
          rather avoid.
        </p>
      </div>

      <TagInput
        label="Colors you like to wear"
        tags={data.colorPreferences}
        onChange={(tags) => onChange({ colorPreferences: tags })}
        placeholder="Type a color or select below"
        suggestions={COLOR_OPTIONS}
      />

      <TagInput
        label="Colors you'd prefer to avoid"
        tags={data.colorsToAvoid}
        onChange={(tags) => onChange({ colorsToAvoid: tags })}
        placeholder="Type a color or select below"
        suggestions={COLOR_OPTIONS}
      />

      <TagInput
        label="Style references (celebrities, influencers, characters)"
        tags={data.styleReferences}
        onChange={(tags) => onChange({ styleReferences: tags })}
        placeholder="e.g., Ryan Gosling, David Beckham"
      />
    </div>
  )
}