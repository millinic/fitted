"use client"

import { cn } from "@/lib/utils"

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  label?: string
  options: readonly RadioOption[] | RadioOption[]
  value: string | null
  onChange: (value: string) => void
  columns?: 1 | 2
  className?: string
}

export function RadioGroup({ label, options, value, onChange, columns = 1, className }: RadioGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {label && <p className="text-sm font-medium text-neutral-700">{label}</p>}
      <div
        className={cn("grid gap-3", {
          "grid-cols-1": columns === 1,
          "grid-cols-1 sm:grid-cols-2": columns === 2,
        })}
      >
        {options.map((option) => {
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "text-left px-5 py-4 rounded-lg border-2 transition-all duration-200",
                isSelected
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "border-neutral-900" : "border-neutral-300"
                  )}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />}
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{option.label}</p>
                  {option.description && (
                    <p className="text-sm text-neutral-500 mt-0.5">{option.description}</p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}