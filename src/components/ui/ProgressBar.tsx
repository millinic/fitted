"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
  const percentage = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-600">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm text-neutral-400">{Math.round(percentage)}%</span>
      </div>
      <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-neutral-900 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}