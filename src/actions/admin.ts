"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, styleAssessments, payments, styleGuides } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import type { ActionResult } from "./assessment"

export async function getAdminStats(): Promise<
  ActionResult<{
    totalUsers: number
    totalAssessments: number
    totalPayments: number
    pendingGuides: number
    deliveredGuides: number
  }>
> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail || session.user.email !== adminEmail) {
      return { success: false, error: "Unauthorized" }
    }

    const [usersCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)

    const [assessmentsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(styleAssessments)

    const [paymentsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(payments)
      .where(eq(payments.status, "completed"))

    const [pendingCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(styleGuides)
      .where(eq(styleGuides.status, "pending_review"))

    const [deliveredCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(styleGuides)
      .where(eq(styleGuides.status, "delivered"))

    return {
      success: true,
      data: {
        totalUsers: usersCount.count,
        totalAssessments: assessmentsCount.count,
        totalPayments: paymentsCount.count,
        pendingGuides: pendingCount.count,
        deliveredGuides: deliveredCount.count,
      },
    }
  } catch (error) {
    console.error("Failed to get admin stats:", error)
    return { success: false, error: "Failed to load stats." }
  }
}