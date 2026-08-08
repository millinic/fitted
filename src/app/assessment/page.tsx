import { Header } from "@/components/layout/Header"
import { AssessmentFlow } from "@/components/assessment/AssessmentFlow"

export const metadata = {
  title: "Style Assessment — Fitted",
  description:
    "Complete your personalized style assessment in under 10 minutes.",
}

export default function AssessmentPage() {
  return (
    <>
      <Header />
      <AssessmentFlow />
    </>
  )
}