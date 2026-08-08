import { Card } from "@/components/ui/Card"
import type { GuideStatus } from "@/types"
import { GUIDE_DELIVERY_DAYS_MIN, GUIDE_DELIVERY_DAYS_MAX } from "@/lib/constants"

interface GuidePendingStatusProps {
  status: GuideStatus
}

const STATUS_MESSAGES: Record<GuideStatus, { title: string; description: string; icon: "spinner" | "eye" | "check" }> = {
  pending_generation: {
    title: "Preparing Your Guide",
    description: "Your style guide is being generated. This should only take a moment.",
    icon: "spinner",
  },
  generating: {
    title: "Generating Your Guide",
    description: "Our AI is crafting your personalized style recommendations. This may take a minute.",
    icon: "spinner",
  },
  pending_review: {
    title: "Under Expert Review",
    description: `Your guide has been generated and is being reviewed by our stylist to ensure every recommendation is perfect. Expected delivery: ${GUIDE_DELIVERY_DAYS_MIN}–${GUIDE_DELIVERY_DAYS_MAX} business days.`,
    icon: "eye",
  },
  revision_requested: {
    title: "Being Refined",
    description: "Our stylist is making adjustments to ensure your guide is perfect. You'll be notified when it's ready.",
    icon: "eye",
  },
  approved: {
    title: "Ready",
    description: "Your guide is ready to view!",
    icon: "check",
  },
  delivered: {
    title: "Delivered",
    description: "Your guide has been delivered.",
    icon: "check",
  },
}

export function GuidePendingStatus({ status }: GuidePendingStatusProps) {
  const message = STATUS_MESSAGES[status]

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center">
      <Card padding="lg">
        <div className="w-16 h-16 mx-auto mb-6 bg-brand-100 rounded-full flex items-center justify-center">
          {message.icon === "spinner" && (
            <div className="w-8 h-8 border-4 border-brand-300 border-t-brand-950 rounded-full animate-spin" />
          )}
          {message.icon === "eye" && (
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
          {message.icon === "check" && (
            <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <h2 className="font-serif text-2xl font-bold text-brand-950 mb-3">{message.title}</h2>
        <p className="text-brand-600 leading-relaxed">{message.description}</p>

        {(status === "pending_review" || status === "revision_requested") && (
          <div className="mt-6 bg-brand-50 rounded-lg p-4">
            <p className="text-xs text-brand-500">
              We&apos;ll send you an email as soon as your guide is ready. You can also check back here anytime.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}