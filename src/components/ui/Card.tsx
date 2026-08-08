import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered"
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-6",
        {
          "bg-white": variant === "default",
          "bg-white shadow-lg shadow-neutral-200/50": variant === "elevated",
          "bg-white border border-neutral-200": variant === "bordered",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}