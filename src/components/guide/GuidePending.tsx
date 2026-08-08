"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { GuideStatus } from "@/types"
import { GUIDE_DELIVERY_MESSAGE, SUPPORT_EMAIL } from "@/lib/constants"
import { Card } from "@/components/ui/Card"

interface GuidePendingProps {
  firstName: string
  status: GuideStatus
  assessmentId: string
}

const STATUS_INFO: Record<GuideStatus, { title: string; message: string }> = {
  generating: {
    title: "Your guide is being generated",
    message: "Our AI is crafting your personalized style recommendations. This usually takes a few minutes.",
  },
  pending_review: {
    title: "Your guide is being reviewed",
    message: GUIDE_DELIVERY_MESSAGE,
  },
  approved: {
    title: "Your guide is ready!",
    message: "Your personalized style guide has been approved and is ready to view.",
  },
  revision_requested: {
    title: "Your guide is being refined",
    message: "Our stylist is making adjustments to ensure your guide is perfect. Check back soon.",
  },
  delivered: {
    title: "Your guide has been delivered",
    message: "Check your email for your personalized style guide.",
  },
}

export function GuidePending({ firstName, status, assessmentId }: GuidePendingProps) {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState(status)
  const info = STATUS_INFO[currentStatus]

  // Poll for status updates if generating or pending
  useEffect(() => {
    if (currentStatus !== "generating" && currentStatus !== "pending_review") return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/guide/${assessmentId}`)
        const data = await res.json()
        if (data.success && data.data) {
          const newStatus = data.data.status as GuideStatus
          setCurrentStatus(newStatus)
          if (newStatus === "approved" || newStatus === "delivered") {
            router.refresh()
          }
        }
      } catch {
        // silently continue polling
      }
    }, 10000) // poll every 10 seconds

    return () => clearInterval(interval)
  }, [currentStatus, assessmentId, router])

  const isLoading = currentStatus === "generating" || currentStatus === "pending_review" || currentStatus === "revision_requested"

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center px-4">
      <Card variant="elevated" className="max-w-md w-full text-center py-12">
        <div className="mb-6 flex justify-center">
          {isLoading ? (
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-brand-200" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-neutral-900 animate-spin" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        <h2 className="font-serif text-2xl text-neutral-900 mb-3">
          Hey {firstName}, {info.title.toLowerCase()}
        </h2>
        <p className="text-neutral-600 leading-relaxed">{info.message}</p>

        {currentStatus === "pending_review" && (
          <div className="mt-8 p-4 bg-brand-50 rounded-lg border border-brand-100">
            <p className="text-sm text-neutral-600">
              <span className="font-medium text-neutral-800">What happens next?</span>
              <br />
              Our founder stylist personally reviews every guide to ensure the recommendations are genuinely excellent and tailored to you. This typically takes 1-3 business days.
            </p>
          </div>
        )}

        {currentStatus === "generating" && (
          <p className="text-sm text-neutral-400 mt-6">
            This page will automatically update when your guide is ready.
          </p>
        )}

        {(currentStatus === "pending_review" || currentStatus === "revision_requested") && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-neutral-400">
              Bookmark this page to check back for updates.
            </p>
            <p className="text-sm text-neutral-400">
              Questions? Reach out at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-600 hover:text-brand-700 underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}