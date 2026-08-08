"use client"

import { cn } from "@/lib/utils"
import { forwardRef, type ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-brand-50 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950":
              variant === "primary",
            "bg-brand-100 text-neutral-900 hover:bg-brand-200 active:bg-brand-300":
              variant === "secondary",
            "border-2 border-neutral-300 text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100":
              variant === "outline",
            "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200":
              variant === "ghost",
          },
          {
            "text-sm px-4 py-2 rounded-md": size === "sm",
            "text-base px-6 py-3 rounded-lg": size === "md",
            "text-lg px-8 py-4 rounded-xl": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"