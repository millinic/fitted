"use client"

import { SelectableCard } from "@/components/ui/SelectableCard"
import { BODY_TYPES, FIT_PREFERENCES } from "@/lib/constants"
import type { AssessmentFormData, BodyType, FitPreference } from "@/types"

interface Props {
  data: AssessmentFormData
  onChange: (updates: Partial<AssessmentFormData>) => void
}

export function BodyFitStep({ data, onChange }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-2">
          Body Type & Fit Preference
        </h2>
        <p className="text-sm text-neutral-500">
          This helps us recommend the right silhouettes and proportions for you.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Which best describes your body type?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BODY_TYPES.map((type) => (
            <SelectableCard
              key={type.value}
              label={type.label}
              selected={data.bodyType === type.value}
              onClick={() => onChange({ bodyType: type.value as BodyType })}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          How do you prefer your clothes to fit?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {FIT_PREFERENCES.map((pref) => (
            <SelectableCard
              key={pref.value}
              label={pref.label}
              selected={data.fitPreference === pref.value}
              onClick={() =>
                onChange({ fitPreference: pref.value as FitPreference })
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}