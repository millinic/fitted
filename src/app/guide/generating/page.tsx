import { Suspense } from "react"
import { GeneratingAnimation } from "@/components/guide/GeneratingAnimation"

export const metadata = {
  title: "Generating Your Guide — Fitted",
  description: "We're creating your personalized style guide.",
}

export default function GeneratingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-50 flex items-center justify-center">
          <div className="animate-pulse text-neutral-400">Loading...</div>
        </div>
      }
    >
      <GeneratingAnimation />
    </Suspense>
  )
}