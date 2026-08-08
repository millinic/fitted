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
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-brand-50 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-brand-950 text-brand-50 hover:bg-brand-800 active:bg-brand-900": variant === "primary",
            "bg-brand-200 text-brand-900 hover:bg-brand-300 active:bg-brand-400": variant === "secondary",
            "border-2 border-brand-300 text-brand-800 hover:bg-brand-100 active:bg-brand-200 bg-transparent": variant === "outline",
            "text-brand-700 hover:bg-brand-100 active:bg-brand-200 bg-transparent": variant === "ghost",
          },
          {
            "px-3 py-1.5 text-sm rounded-md": size === "sm",
            "px-5 py-2.5 text-base rounded-lg": size === "md",
            "px-8 py-3.5 text-lg rounded-xl": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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