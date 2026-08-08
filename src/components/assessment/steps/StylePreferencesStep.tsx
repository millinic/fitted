"use client"

import type { AssessmentFormData } from "@/types"
import { Input } from "@/components/ui/Input"
import { MultiSelect } from "@/components/ui/MultiSelect"

interface StepProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
}

const WARDROBE_GAPS = [
  "Everyday casual",
  "Work/office appropriate",
  "Going out / nightlife",
  "Outerwear / jackets",
  "Footwear",
  "Accessories",
  "Layering pieces",
  "Quality basics",
]

export function StylePreferencesStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-neutral-900 mb-2">Style preferences</h2>
        <p className="text-neutral-500">
          Help us understand the aesthetic you&apos;re drawn to.
        </p>
      </div>

      <Input
        label="Style references (celebrities, influencers, or people whose style you admire)"
        value={formData.styleReferences.join(", ")}
        onChange={(e) =>
          updateFormData({
            styleReferences: e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
        placeholder="e.g. Ryan Gosling, Tyler the Creator, David Beckham"
        hint="Separate with commas"
      />

      <MultiSelect
        label="Where do you feel your wardrobe is most lacking?"
        options={WARDROBE_GAPS}
        selected={formData.wardrobeGaps}
        onChange={(selected) => updateFormData({ wardrobeGaps: selected })}
      />
    </div>
  )
}