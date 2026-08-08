"use client"

import { cn } from "@/lib/utils"

interface SelectionCardProps {
  label: string
  description?: string
  selected: boolean
  onClick: () => void
  className?: string
}

export function SelectionCard({ label, description, selected, onClick, className }: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
        selected
          ? "border-brand-950 bg-brand-950/5"
          : "border-brand-200 bg-white hover:border-brand-400",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
            selected ? "border-brand-950 bg-brand-950" : "border-brand-300"
          )}
        >
          {selected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div>
          <p className="font-medium text-brand-900">{label}</p>
          {description && <p className="text-sm text-brand-500 mt-0.5">{description}</p>}
        </div>
      </div>
    </button>
  )
}