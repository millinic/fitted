"use client"

import { SelectionCard } from "@/components/ui/SelectionCard"
import { BODY_TYPES, FIT_PREFERENCES } from "@/lib/constants"
import type { AssessmentFormData, BodyType, FitPreference } from "@/types"

interface StepBodyFitProps {
  data: AssessmentFormData
  onChange: (data: Partial<AssessmentFormData>) => void
}

export function StepBodyFit({ data, onChange }: StepBodyFitProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-brand-700 mb-3">Body Type</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {BODY_TYPES.map((type) => (
            <SelectionCard
              key={type.value}
              label={type.label}
              selected={data.bodyType === type.value}
              onClick={() => onChange({ bodyType: type.value as BodyType })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-700 mb-3">Fit Preference</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {FIT_PREFERENCES.map((pref) => (
            <SelectionCard
              key={pref.value}
              label={pref.label}
              selected={data.fitPreference === pref.value}
              onClick={() => onChange({ fitPreference: pref.value as FitPreference })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}