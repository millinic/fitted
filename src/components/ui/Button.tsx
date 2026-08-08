"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950":
              variant === "primary",
            "bg-brand-100 text-brand-900 hover:bg-brand-200 active:bg-brand-300":
              variant === "secondary",
            "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100":
              variant === "outline",
            "bg-transparent text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100":
              variant === "ghost",
          },
          {
            "h-9 px-4 text-sm rounded-md": size === "sm",
            "h-11 px-6 text-sm rounded-lg": size === "md",
            "h-13 px-8 text-base rounded-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = "Button"