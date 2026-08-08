import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { guideFeedback, styleGuides } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { guideId, overallRating, feltPersonalized, comments, flaggedItems } = await request.json()

    if (!guideId) {
      return NextResponse.json({ error: "Guide ID required" }, { status: 400 })
    }

    // Verify guide belongs to user
    const guides = await db
      .select()
      .from(styleGuides)
      .where(
        and(
          eq(styleGuides.id, guideId),
          eq(styleGuides.userId, session.user.id)
        )
      )
      .limit(1)

    if (!guides[0]) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 })
    }

    await db.insert(guideFeedback).values({
      guideId,
      userId: session.user.id,
      overallRating: overallRating ?? null,
      feltPersonalized: feltPersonalized ?? null,
      comments: comments ?? null,
      flaggedItems: flaggedItems ?? null,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}