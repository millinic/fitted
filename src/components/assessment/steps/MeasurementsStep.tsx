"use client"

import type { AssessmentFormData } from "@/types"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { TOP_SIZES, BOTTOM_SIZES } from "@/lib/constants"

interface StepProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
}

export function MeasurementsStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-neutral-900 mb-2">Measurements & sizing</h2>
        <p className="text-neutral-500">
          These help us recommend the right sizes and fits. Don&apos;t worry about being exact —
          estimates work fine.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-700 mb-2">Height</p>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            value={formData.heightFeet ?? ""}
            onChange={(e) => updateFormData({ heightFeet: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="5"
            min={4}
            max={7}
          />
          <Input
            type="number"
            value={formData.heightInches ?? ""}
            onChange={(e) => updateFormData({ heightInches: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="10"
            min={0}
            max={11}
          />
        </div>
        <p className="text-xs text-neutral-400 mt-1">Feet &amp; Inches</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Chest (inches)"
          type="number"
          value={formData.chest ?? ""}
          onChange={(e) => updateFormData({ chest: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="40"
        />
        <Input
          label="Waist (inches)"
          type="number"
          value={formData.waist ?? ""}
          onChange={(e) => updateFormData({ waist: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="32"
        />
        <Input
          label="Inseam (inches)"
          type="number"
          value={formData.inseam ?? ""}
          onChange={(e) => updateFormData({ inseam: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="30"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Typical Top Size"
          value={formData.typicalTopSize}
          onChange={(e) => updateFormData({ typicalTopSize: e.target.value })}
          options={TOP_SIZES.map((s) => ({ value: s, label: s }))}
          placeholder="Select size"
        />
        <Select
          label="Typical Bottom Size"
          value={formData.typicalBottomSize}
          onChange={(e) => updateFormData({ typicalBottomSize: e.target.value })}
          options={BOTTOM_SIZES.map((s) => ({ value: s, label: s }))}
          placeholder="Select size"
        />
      </div>

      <Input
        label="Shoe Size (US)"
        value={formData.shoeSize}
        onChange={(e) => updateFormData({ shoeSize: e.target.value })}
        placeholder="10"
      />
    </div>
  )
}