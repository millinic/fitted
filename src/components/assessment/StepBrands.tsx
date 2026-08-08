"use client"

import { MultiSelectCard } from "@/components/ui/MultiSelectCard"
import { REFERENCE_BRANDS } from "@/lib/constants"
import type { AssessmentFormData } from "@/types"

interface StepBrandsProps {
  data: AssessmentFormData
  onChange: (data: Partial<AssessmentFormData>) => void
}

export function StepBrands({ data, onChange }: StepBrandsProps) {
  const brandsLiked = data.brandsLiked || []
  const brandFitReferences = data.brandFitReferences || []

  function toggleBrandLiked(brand: string) {
    const updated = brandsLiked.includes(brand)
      ? brandsLiked.filter((b) => b !== brand)
      : [...brandsLiked, brand]
    onChange({ brandsLiked: updated })
  }

  function toggleBrandFit(brand: string) {
    const updated = brandFitReferences.includes(brand)
      ? brandFitReferences.filter((b) => b !== brand)
      : [...brandFitReferences, brand]
    onChange({ brandFitReferences: updated })
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-brand-700 mb-1">
          Brands you like the aesthetic of
        </p>
        <p className="text-xs text-brand-500 mb-3">Select any brands whose style you admire</p>
        <div className="flex flex-wrap gap-2">
          {REFERENCE_BRANDS.map((brand) => (
            <MultiSelectCard
              key={brand}
              label={brand}
              selected={brandsLiked.includes(brand)}
              onClick={() => toggleBrandLiked(brand)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-700 mb-1">
          Brands that generally fit you well
        </p>
        <p className="text-xs text-brand-500 mb-3">These help us nail your sizing recommendations</p>
        <div className="flex flex-wrap gap-2">
          {REFERENCE_BRANDS.map((brand) => (
            <MultiSelectCard
              key={brand}
              label={brand}
              selected={brandFitReferences.includes(brand)}
              onClick={() => toggleBrandFit(brand)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}