"use client"

import { useState } from "react"
import { Input } from "@/components/ui/Input"
import type { AssessmentFormData } from "@/types"

interface StepReferencesProps {
  data: AssessmentFormData
  onChange: (data: Partial<AssessmentFormData>) => void
}

export function StepReferences({ data, onChange }: StepReferencesProps) {
  const [inputValue, setInputValue] = useState("")
  const references = data.styleReferences || []

  function addReference() {
    const trimmed = inputValue.trim()
    if (trimmed && !references.includes(trimmed)) {
      onChange({ styleReferences: [...references, trimmed] })
      setInputValue("")
    }
  }

  function removeReference(ref: string) {
    onChange({ styleReferences: references.filter((r) => r !== ref) })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      addReference()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-700 mb-1">
          Style icons or references
        </p>
        <p className="text-xs text-brand-500 mb-3">
          Celebrities, influencers, or public figures whose style you admire.
          Type a name and press Enter.
        </p>
        <div className="flex gap-2">
          <Input
            id="styleReference"
            placeholder="e.g., David Beckham, Tyler the Creator"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <button
            type="button"
            onClick={addReference}
            className="px-4 py-2.5 bg-brand-950 text-white rounded-lg hover:bg-brand-800 transition-colors text-sm font-medium"
          >
            Add
          </button>
        </div>
      </div>

      {references.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {references.map((ref) => (
            <span
              key={ref}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-100 text-brand-800 rounded-full text-sm"
            >
              {ref}
              <button
                type="button"
                onClick={() => removeReference(ref)}
                className="text-brand-500 hover:text-brand-800 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="bg-brand-100/50 rounded-lg p-4 border border-brand-200">
        <p className="text-sm text-brand-600">
          <strong className="text-brand-700">Not sure?</strong> That&apos;s perfectly fine.
          You can skip this step — your other answers give us plenty to work with.
        </p>
      </div>
    </div>
  )
}