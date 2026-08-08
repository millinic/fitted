import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { DashboardContent } from "@/components/dashboard/DashboardContent"

export const metadata = {
  title: "Dashboard — Fitted",
  description: "View your style profile and guide status.",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/dashboard")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-50 pt-24 pb-16">
        <DashboardContent />
      </main>
      <Footer />
    </>
  )
}