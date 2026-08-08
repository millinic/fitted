"use client"

import type { AssessmentFormData } from "@/types"
import { MultiSelect } from "@/components/ui/MultiSelect"
import { BRAND_TIERS } from "@/lib/constants"
import { Input } from "@/components/ui/Input"

interface StepProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
}

const ALL_BRANDS = [...BRAND_TIERS.accessible, ...BRAND_TIERS.premium, ...BRAND_TIERS.luxury]

export function BrandsStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-neutral-900 mb-2">Brands</h2>
        <p className="text-neutral-500">
          Which brands do you already wear or aspire to? This helps us calibrate recommendations.
        </p>
      </div>

      <MultiSelect
        label="Brands you currently like or wear (select all that apply)"
        options={ALL_BRANDS}
        selected={formData.brandsLiked}
        onChange={(selected) => updateFormData({ brandsLiked: selected })}
        columns={3}
      />

      <Input
        label="Other brands you like (not listed above)"
        value={formData.brandFitReferences.join(", ")}
        onChange={(e) =>
          updateFormData({
            brandFitReferences: e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
        placeholder="e.g. Everlane, Bonobos, Lululemon"
        hint="Separate with commas"
      />
    </div>
  )
}