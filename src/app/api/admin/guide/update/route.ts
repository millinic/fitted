import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { styleGuides } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { ApiResponse } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { guideId, status, founderNotes } = await request.json()

    if (!guideId || !status) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Guide ID and status are required" },
        { status: 400 }
      )
    }

    const validStatuses = ["generating", "pending_review", "approved", "revision_requested", "delivered"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid status" },
        { status: 400 }
      )
    }

    const db = getDb()

    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    }

    if (founderNotes !== undefined) {
      updateData.founderNotes = founderNotes
    }

    if (status === "approved" || status === "delivered") {
      updateData.reviewedAt = new Date()
    }

    if (status === "delivered") {
      updateData.deliveredAt = new Date()
    }

    await db
      .update(styleGuides)
      .set(updateData)
      .where(eq(styleGuides.id, guideId))

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Guide status updated to ${status}`,
    })
  } catch (error: any) {
    console.error("Admin guide update error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || "Failed to update guide" },
      { status: 500 }
    )
  }
}