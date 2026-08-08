"use client"

import type { AssessmentFormData } from "@/types"
import { Input } from "@/components/ui/Input"

interface StepProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
}

export function BasicsStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-neutral-900 mb-2">Let&apos;s start with the basics</h2>
        <p className="text-neutral-500">Tell us a bit about yourself so we can personalize your experience.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => updateFormData({ firstName: e.target.value })}
          placeholder="Pat"
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => updateFormData({ lastName: e.target.value })}
          placeholder="Smith"
        />
      </div>

      <Input
        label="Age"
        type="number"
        value={formData.age ?? ""}
        onChange={(e) => updateFormData({ age: e.target.value ? parseInt(e.target.value) : null })}
        placeholder="32"
        min={18}
        max={100}
      />

      <Input
        label="Location"
        value={formData.location}
        onChange={(e) => updateFormData({ location: e.target.value })}
        placeholder="Los Angeles, CA"
        hint="Helps us recommend weather-appropriate pieces"
      />
    </div>
  )
}