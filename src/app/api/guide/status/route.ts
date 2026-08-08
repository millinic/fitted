import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { styleGuides } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const guideId = req.nextUrl.searchParams.get("guideId")
    if (!guideId) {
      return NextResponse.json({ error: "Missing guideId" }, { status: 400 })
    }

    const result = await db
      .select({ status: styleGuides.status })
      .from(styleGuides)
      .where(
        and(
          eq(styleGuides.id, guideId),
          eq(styleGuides.userId, session.user.id)
        )
      )
      .limit(1)

    if (result.length === 0) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 })
    }

    return NextResponse.json({ status: result[0].status })
  } catch (error) {
    console.error("Guide status check failed:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}