"use client"

import { cn } from "@/lib/utils"

interface MultiSelectProps {
  label?: string
  options: readonly string[] | string[]
  selected: string[]
  onChange: (selected: string[]) => void
  columns?: 1 | 2 | 3
  className?: string
}

export function MultiSelect({ label, options, selected, onChange, columns = 2, className }: MultiSelectProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && <p className="text-sm font-medium text-neutral-700">{label}</p>}
      <div
        className={cn("grid gap-2", {
          "grid-cols-1": columns === 1,
          "grid-cols-1 sm:grid-cols-2": columns === 2,
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": columns === 3,
        })}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={cn(
                "text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm",
                isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
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