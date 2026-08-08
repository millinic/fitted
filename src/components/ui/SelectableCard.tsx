"use client"

import { cn } from "@/lib/utils"

interface SelectableCardProps {
  selected: boolean
  onClick: () => void
  label: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function SelectableCard({
  selected,
  onClick,
  label,
  description,
  icon,
  className,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 p-4 rounded-lg border text-left transition-all duration-200",
        selected
          ? "border-neutral-900 bg-neutral-900/5 ring-1 ring-neutral-900"
          : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50",
        className
      )}
    >
      {icon && <span className="text-lg mb-1">{icon}</span>}
      <span className={cn("text-sm font-medium", selected ? "text-neutral-900" : "text-neutral-700")}>
        {label}
      </span>
      {description && (
        <span className="text-xs text-neutral-500">{description}</span>
      )}
    </button>
  )
}