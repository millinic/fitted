import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { StyleGuideView } from "@/components/guide/StyleGuideView"

export const metadata = {
  title: "Your Style Guide — Fitted",
  description: "Your personalized, expert-curated wardrobe guide.",
}

export default async function GuidePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/guide")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-50 pt-24 pb-16">
        <StyleGuideView />
      </main>
      <Footer />
    </>
  )
}