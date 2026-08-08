"use client"

import { cn } from "@/lib/utils"
import { forwardRef, type SelectHTMLAttributes } from "react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string; description?: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition-colors duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 appearance-none",
            error && "border-error focus:border-error focus:ring-red-100",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
              {opt.description ? ` — ${opt.description}` : ""}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    )
  }
)

Select.displayName = "Select"