import { Suspense } from "react"
import { Header } from "@/components/layout/Header"
import { GeneratingAnimation } from "@/components/guide/GeneratingAnimation"

export const metadata = {
  title: "Generating Your Style Guide — Fitted",
  description: "We're creating your personalized style guide.",
}

export default function GeneratingPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Suspense
          fallback={
            <div className="min-h-screen bg-brand-50 flex items-center justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-brand-200" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-neutral-900 animate-spin" />
              </div>
            </div>
          }
        >
          <GeneratingAnimation />
        </Suspense>
      </main>
    </>
  )
}