import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { db } from "@/lib/db"
import { styleGuides } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { GuideDisplay } from "@/components/guide/GuideDisplay"
import { GuidePendingStatus } from "@/components/guide/GuidePendingStatus"

export default async function GuidePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/guide")
  }

  const guides = await db
    .select()
    .from(styleGuides)
    .where(eq(styleGuides.userId, session.user.id))
    .limit(1)

  const guide = guides[0]

  if (!guide) {
    redirect("/assessment")
  }

  const isReady = guide.status === "approved" || guide.status === "delivered"

  if (guide.status === "approved" && guide.guideContent) {
    await db
      .update(styleGuides)
      .set({ status: "delivered", deliveredAt: new Date(), updatedAt: new Date() })
      .where(eq(styleGuides.id, guide.id))
  }

  return (
    <>
      <Header />
      <main className="min-h-[80vh]">
        {isReady && guide.guideContent ? (
          <GuideDisplay
            guide={{
              id: guide.id,
              content: guide.guideContent,
              createdAt: guide.createdAt,
            }}
            userName={session.user.name || undefined}
          />
        ) : (
          <GuidePendingStatus status={guide.status} />
        )}
      </main>
      <Footer />
    </>
  )
}