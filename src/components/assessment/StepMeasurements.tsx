"use client"

import { Input } from "@/components/ui/Input"
import { MultiSelectCard } from "@/components/ui/MultiSelectCard"
import { SHIRT_SIZES } from "@/lib/constants"
import type { AssessmentFormData } from "@/types"

interface StepMeasurementsProps {
  data: AssessmentFormData
  onChange: (data: Partial<AssessmentFormData>) => void
}

export function StepMeasurements({ data, onChange }: StepMeasurementsProps) {
  return (
    <div className="space-y-6">
      <Input
        id="height"
        label="Height"
        placeholder={"e.g., 5'10\" or 178cm"}
        value={data.height || ""}
        onChange={(e) => onChange({ height: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="waistSize"
          label="Waist Size (inches)"
          type="number"
          placeholder="32"
          value={data.waistSize ?? ""}
          onChange={(e) => onChange({ waistSize: e.target.value ? parseInt(e.target.value) : undefined })}
        />
        <Input
          id="chestSize"
          label="Chest Size (inches)"
          type="number"
          placeholder="40"
          value={data.chestSize ?? ""}
          onChange={(e) => onChange({ chestSize: e.target.value ? parseInt(e.target.value) : undefined })}
        />
      </div>

      <Input
        id="inseam"
        label="Inseam (inches)"
        type="number"
        placeholder="32"
        value={data.inseam ?? ""}
        onChange={(e) => onChange({ inseam: e.target.value ? parseInt(e.target.value) : undefined })}
      />

      <div>
        <p className="text-sm font-medium text-brand-700 mb-2">Typical Shirt Size</p>
        <div className="flex flex-wrap gap-2">
          {SHIRT_SIZES.map((size) => (
            <MultiSelectCard
              key={size}
              label={size}
              selected={data.typicalShirtSize === size}
              onClick={() => onChange({ typicalShirtSize: size })}
            />
          ))}
        </div>
      </div>

      <Input
        id="typicalPantSize"
        label="Typical Pant Size"
        placeholder="e.g., 32x32 or Medium"
        value={data.typicalPantSize || ""}
        onChange={(e) => onChange({ typicalPantSize: e.target.value })}
      />

      <Input
        id="shoeSize"
        label="Shoe Size (US)"
        placeholder="e.g., 10.5"
        value={data.shoeSize || ""}
        onChange={(e) => onChange({ shoeSize: e.target.value })}
      />
    </div>
  )
}