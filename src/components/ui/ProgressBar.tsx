"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-brand-600">
          Step {current} of {total}
        </span>
        <span className="text-sm text-brand-500">{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-brand-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-950 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}