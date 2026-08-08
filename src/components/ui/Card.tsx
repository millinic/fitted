import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg"
}

export function Card({ className, padding = "md", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-brand-200 shadow-sm",
        {
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}