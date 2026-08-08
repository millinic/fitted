"use client"

import { cn } from "@/lib/utils"

interface MultiSelectProps {
  options: readonly string[]
  selected: string[]
  onChange: (selected: string[]) => void
  label?: string
  maxSelections?: number
  columns?: 2 | 3
}

export function MultiSelect({
  options,
  selected,
  onChange,
  label,
  maxSelections,
  columns = 2,
}: MultiSelectProps) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option))
    } else if (!maxSelections || selected.length < maxSelections) {
      onChange([...selected, option])
    }
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
          {maxSelections && (
            <span className="text-neutral-400 font-normal ml-1">
              (select up to {maxSelections})
            </span>
          )}
        </label>
      )}
      <div
        className={cn(
          "grid gap-2",
          columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
        )}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={cn(
                "px-4 py-2.5 rounded-lg border text-sm text-left transition-all duration-200",
                isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}