"use client"

import React from "react"
import { Input } from "@/components/ui/Input"
import type { AssessmentFormData } from "@/types"

interface Props {
  data: AssessmentFormData
  onChange: (updates: Partial<AssessmentFormData>) => void
}

export function MeasurementsStep({ data, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-2">
          Measurements &amp; Sizing
        </h2>
        <p className="text-sm text-neutral-500">
          Help us understand your fit. Approximate sizes are fine — we are
          looking for a general picture, not precision.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="height"
          label="Height"
          placeholder="e.g., 5'10&quot; or 178cm"
          value={data.height}
          onChange={(e) => onChange({ height: e.target.value })}
        />
        <Input
          id="chestSize"
          label="Chest"
          placeholder="e.g., 40&quot; or M"
          value={data.chestSize}
          onChange={(e) => onChange({ chestSize: e.target.value })}
        />
        <Input
          id="waistSize"
          label="Waist"
          placeholder="e.g., 32&quot;"
          value={data.waistSize}
          onChange={(e) => onChange({ waistSize: e.target.value })}
        />
        <Input
          id="inseam"
          label="Inseam"
          placeholder="e.g., 32&quot;"
          value={data.inseam}
          onChange={(e) => onChange({ inseam: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          id="typicalShirtSize"
          label="Shirt Size"
          placeholder="e.g., M or 15.5"
          value={data.typicalShirtSize}
          onChange={(e) => onChange({ typicalShirtSize: e.target.value })}
        />
        <Input
          id="typicalPantSize"
          label="Pant Size"
          placeholder="e.g., 32x32"
          value={data.typicalPantSize}
          onChange={(e) => onChange({ typicalPantSize: e.target.value })}
        />
        <Input
          id="shoeSize"
          label="Shoe Size"
          placeholder="e.g., 10 US"
          value={data.shoeSize}
          onChange={(e) => onChange({ shoeSize: e.target.value })}
        />
      </div>
    </div>
  )
}