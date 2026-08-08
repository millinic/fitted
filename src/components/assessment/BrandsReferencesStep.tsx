"use client"

import { TagInput } from "@/components/ui/TagInput"
import { BRAND_TIERS } from "@/lib/constants"
import type { AssessmentFormData } from "@/types"

const ALL_BRANDS = [
  ...BRAND_TIERS.accessible,
  ...BRAND_TIERS.premium,
  ...BRAND_TIERS.luxury,
] as const

interface Props {
  data: AssessmentFormData
  onChange: (updates: Partial<AssessmentFormData>) => void
}

export function BrandsReferencesStep({ data, onChange }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-2">
          Brands & References
        </h2>
        <p className="text-sm text-neutral-500">
          Knowing what you already like and what fits well helps us make better
          recommendations.
        </p>
      </div>

      <TagInput
        label="Brands whose aesthetic you like"
        tags={data.brandsLiked}
        onChange={(tags) => onChange({ brandsLiked: tags })}
        placeholder="Start typing a brand name"
        suggestions={ALL_BRANDS}
      />

      <TagInput
        label="Brands that generally fit you well"
        tags={data.brandFitReferences}
        onChange={(tags) => onChange({ brandFitReferences: tags })}
        placeholder="Start typing a brand name"
        suggestions={ALL_BRANDS}
      />
    </div>
  )
}