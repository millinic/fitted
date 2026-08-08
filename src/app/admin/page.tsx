import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/layout/Header"
import { AdminDashboard } from "@/components/admin/AdminDashboard"

export const metadata = {
  title: "Admin — Fitted",
  description: "Founder review and approval interface.",
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/admin")
  }

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || session.user.email !== adminEmail) {
    redirect("/dashboard")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-50 pt-24 pb-16">
        <AdminDashboard />
      </main>
    </>
  )
}