import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { styleGuides } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { ApiResponse } from "@/types"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const { assessmentId } = await params

    const db = getDb()

    const guide = await db.query.styleGuides.findFirst({
      where: eq(styleGuides.assessmentId, assessmentId),
    })

    if (!guide) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Guide not found" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        id: guide.id,
        status: guide.status,
        introduction: guide.introduction,
        recommendations: guide.recommendations,
        lookbooks: guide.lookbooks,
        generalAdvice: guide.generalAdvice,
        createdAt: guide.createdAt,
        deliveredAt: guide.deliveredAt,
      },
    })
  } catch (error: any) {
    console.error("Guide fetch error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch guide" },
      { status: 500 }
    )
  }
}