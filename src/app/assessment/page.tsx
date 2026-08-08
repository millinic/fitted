import { Header } from "@/components/layout/Header"
import { AssessmentWizard } from "@/components/assessment/AssessmentWizard"

export const metadata = {
  title: "Style Assessment — Fitted",
  description: "Complete your personalized style assessment in under 10 minutes.",
}

export default function AssessmentPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <AssessmentWizard />
      </main>
    </>
  )
}