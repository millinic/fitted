import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { styleAssessments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { AssessmentFormData } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data: AssessmentFormData = body.data

    const inserted = await db
      .insert(styleAssessments)
      .values({
        userId: session.user.id,
        waistSize: data.waistSize ?? null,
        chestSize: data.chestSize ?? null,
        inseam: data.inseam ?? null,
        typicalShirtSize: data.typicalShirtSize ?? null,
        typicalPantSize: data.typicalPantSize ?? null,
        shoeSize: data.shoeSize ?? null,
        height: data.height ?? null,
        bodyType: data.bodyType ?? null,
        fitPreference: data.fitPreference ?? null,
        brandFitReferences: data.brandFitReferences ?? null,
        brandsLiked: data.brandsLiked ?? null,
        lifestyleContext: data.lifestyleContext ?? null,
        lifestyleFrequency: data.lifestyleFrequency ?? null,
        styleGoals: data.styleGoals ?? null,
        styleReferences: data.styleReferences ?? null,
        colorPreferences: data.colorPreferences ?? null,
        wardrobeGaps: data.wardrobeGaps ?? null,
        budgetRange: data.budgetRange ?? null,
        shoppingBehavior: data.shoppingBehavior ?? null,
        completedAt: new Date(),
      })
      .returning({ id: styleAssessments.id })

    return NextResponse.json({
      success: true,
      data: { assessmentId: inserted[0].id },
    })
  } catch (error) {
    console.error("Assessment creation error:", error)
    return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data: AssessmentFormData = body.data
    const assessmentId: string = body.assessmentId

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID required" }, { status: 400 })
    }

    const existing = await db
      .select({ userId: styleAssessments.userId })
      .from(styleAssessments)
      .where(eq(styleAssessments.id, assessmentId))
      .limit(1)

    if (!existing[0] || existing[0].userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await db
      .update(styleAssessments)
      .set({
        waistSize: data.waistSize ?? null,
        chestSize: data.chestSize ?? null,
        inseam: data.inseam ?? null,
        typicalShirtSize: data.typicalShirtSize ?? null,
        typicalPantSize: data.typicalPantSize ?? null,
        shoeSize: data.shoeSize ?? null,
        height: data.height ?? null,
        bodyType: data.bodyType ?? null,
        fitPreference: data.fitPreference ?? null,
        brandFitReferences: data.brandFitReferences ?? null,
        brandsLiked: data.brandsLiked ?? null,
        lifestyleContext: data.lifestyleContext ?? null,
        lifestyleFrequency: data.lifestyleFrequency ?? null,
        styleGoals: data.styleGoals ?? null,
        styleReferences: data.styleReferences ?? null,
        colorPreferences: data.colorPreferences ?? null,
        wardrobeGaps: data.wardrobeGaps ?? null,
        budgetRange: data.budgetRange ?? null,
        shoppingBehavior: data.shoppingBehavior ?? null,
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(styleAssessments.id, assessmentId))

    return NextResponse.json({
      success: true,
      data: { assessmentId },
    })
  } catch (error) {
    console.error("Assessment update error:", error)
    return NextResponse.json({ error: "Failed to update assessment" }, { status: 500 })
  }
}