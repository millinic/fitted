import { Suspense } from "react"
import { StyleProfileView } from "@/components/profile/StyleProfileView"

export const metadata = {
  title: "Your Style Profile — Fitted",
  description: "Your personalized style archetype and aesthetic direction.",
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-50 flex items-center justify-center">
          <div className="animate-pulse text-neutral-400">
            Loading your profile...
          </div>
        </div>
      }
    >
      <StyleProfileView />
    </Suspense>
  )
}