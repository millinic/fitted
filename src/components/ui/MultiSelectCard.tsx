"use client"

import { cn } from "@/lib/utils"

interface MultiSelectCardProps {
  label: string
  selected: boolean
  onClick: () => void
  className?: string
}

export function MultiSelectCard({ label, selected, onClick, className }: MultiSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200",
        selected
          ? "border-brand-950 bg-brand-950 text-white"
          : "border-brand-200 bg-white text-brand-700 hover:border-brand-400",
        className
      )}
    >
      {label}
    </button>
  )
}