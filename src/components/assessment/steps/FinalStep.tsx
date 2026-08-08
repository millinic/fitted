"use client"

import type { AssessmentFormData } from "@/types"

interface StepProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
}

export function FinalStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-neutral-900 mb-2">Almost there</h2>
        <p className="text-neutral-500">
          Anything else we should know? This is your chance to share any additional context —
          upcoming events, specific items you&apos;ve been eyeing, or anything you think would help
          us create the perfect guide for you.
        </p>
      </div>

      <textarea
        value={formData.additionalNotes}
        onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 min-h-[150px] resize-y"
        placeholder="e.g. I have a wedding coming up in September, I'm looking for more versatile pieces that work from day to evening, I tend to run warm..."
      />

      <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
        <h3 className="font-serif text-lg text-neutral-900 mb-3">Quick review</h3>
        <div className="space-y-2 text-sm text-neutral-600">
          <p>
            <span className="font-medium text-neutral-800">Name:</span> {formData.firstName} {formData.lastName}
          </p>
          {formData.age && (
            <p>
              <span className="font-medium text-neutral-800">Age:</span> {formData.age}
            </p>
          )}
          {formData.location && (
            <p>
              <span className="font-medium text-neutral-800">Location:</span> {formData.location}
            </p>
          )}
          {formData.heightFeet && formData.heightInches !== null && (
            <p>
              <span className="font-medium text-neutral-800">Height:</span> {formData.heightFeet}&apos;{formData.heightInches}&quot;
            </p>
          )}
          {formData.bodyType && (
            <p>
              <span className="font-medium text-neutral-800">Body type:</span> {formData.bodyType}
            </p>
          )}
          {formData.fitPreference && (
            <p>
              <span className="font-medium text-neutral-800">Fit preference:</span> {formData.fitPreference}
            </p>
          )}
          {formData.styleGoal && (
            <p>
              <span className="font-medium text-neutral-800">Style goal:</span> {formData.styleGoal}
            </p>
          )}
          {formData.budgetRange && (
            <p>
              <span className="font-medium text-neutral-800">Budget:</span> {formData.budgetRange}
            </p>
          )}
          {formData.lifestyleContext.length > 0 && (
            <p>
              <span className="font-medium text-neutral-800">Lifestyle:</span> {formData.lifestyleContext.join(", ")}
            </p>
          )}
          {formData.brandsLiked.length > 0 && (
            <p>
              <span className="font-medium text-neutral-800">Brands:</span> {formData.brandsLiked.slice(0, 5).join(", ")}{formData.brandsLiked.length > 5 ? ` +${formData.brandsLiked.length - 5} more` : ""}
            </p>
          )}
          {formData.colorPreferences.length > 0 && (
            <p>
              <span className="font-medium text-neutral-800">Colors:</span> {formData.colorPreferences.join(", ")}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-neutral-400 text-center">
        Click &ldquo;See My Style Profile&rdquo; to generate your personalized style summary.
      </p>
    </div>
  )
}