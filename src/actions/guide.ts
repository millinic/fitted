"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { styleGuides, guideFeedback, styleProfileSummaries } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getResend } from "@/lib/resend"
import type { ActionResult } from "./assessment"
import type { StyleGuide, StyleProfileSummaryContent } from "@/types"

export async function getGuideStatus(
  guideId: string
): Promise<ActionResult<{ status: string; guide: StyleGuide | null }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const result = await db
      .select()
      .from(styleGuides)
      .where(
        and(eq(styleGuides.id, guideId), eq(styleGuides.userId, session.user.id))
      )
      .limit(1)

    if (result.length === 0) {
      return { success: false, error: "Guide not found" }
    }

    return {
      success: true,
      data: { status: result[0].status, guide: result[0] as StyleGuide },
    }
  } catch (error) {
    console.error("Failed to get guide status:", error)
    return { success: false, error: "Failed to load guide status." }
  }
}

export async function getUserGuide(): Promise<ActionResult<{
  guide: StyleGuide | null
  profileSummary: StyleProfileSummaryContent | null
}>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const guideResult = await db
      .select()
      .from(styleGuides)
      .where(eq(styleGuides.userId, session.user.id))
      .limit(1)

    if (guideResult.length === 0) {
      return { success: true, data: { guide: null, profileSummary: null } }
    }

    const guide = guideResult[0]

    // Get profile summary
    const summaryResult = await db
      .select()
      .from(styleProfileSummaries)
      .where(eq(styleProfileSummaries.assessmentId, guide.assessmentId))
      .limit(1)

    const profileSummary =
      summaryResult.length > 0
        ? (summaryResult[0].summaryContent as StyleProfileSummaryContent)
        : null

    return {
      success: true,
      data: { guide: guide as StyleGuide, profileSummary },
    }
  } catch (error) {
    console.error("Failed to get user guide:", error)
    return { success: false, error: "Failed to load guide." }
  }
}

export async function getProfileSummary(assessmentId: string): Promise<
  ActionResult<{ profileSummary: StyleProfileSummaryContent | null }>
> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const result = await db
      .select()
      .from(styleProfileSummaries)
      .where(
        and(
          eq(styleProfileSummaries.assessmentId, assessmentId),
          eq(styleProfileSummaries.userId, session.user.id)
        )
      )
      .limit(1)

    if (result.length === 0) {
      return { success: true, data: { profileSummary: null } }
    }

    return {
      success: true,
      data: {
        profileSummary: result[0].summaryContent as StyleProfileSummaryContent,
      },
    }
  } catch (error) {
    console.error("Failed to get profile summary:", error)
    return { success: false, error: "Failed to load profile summary." }
  }
}

export async function submitGuideFeedback(data: {
  guideId: string
  overallRating: number
  personalizedFeeling: number
  wouldRefer: boolean
  flaggedItems: Array<{ itemName: string; reason: string }>
  freeformFeedback: string
}): Promise<ActionResult<{ feedbackId: string }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    // Verify guide belongs to user
    const guideCheck = await db
      .select({ id: styleGuides.id })
      .from(styleGuides)
      .where(
        and(
          eq(styleGuides.id, data.guideId),
          eq(styleGuides.userId, session.user.id)
        )
      )
      .limit(1)

    if (guideCheck.length === 0) {
      return { success: false, error: "Guide not found" }
    }

    const result = await db
      .insert(guideFeedback)
      .values({
        userId: session.user.id,
        guideId: data.guideId,
        overallRating: data.overallRating,
        personalizedFeeling: data.personalizedFeeling,
        wouldRefer: data.wouldRefer,
        flaggedItems: data.flaggedItems,
        freeformFeedback: data.freeformFeedback,
      })
      .returning({ id: guideFeedback.id })

    return { success: true, data: { feedbackId: result[0].id } }
  } catch (error) {
    console.error("Failed to submit feedback:", error)
    return { success: false, error: "Failed to submit feedback." }
  }
}

// ─── Admin/Founder Actions ────────────────────────────────────────

function getAdminEmail(): string | undefined {
  return process.env.ADMIN_EMAIL
}

export async function getPendingGuides(): Promise<ActionResult<StyleGuide[]>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const adminEmail = getAdminEmail()
    if (!adminEmail || session.user.email !== adminEmail) {
      return { success: false, error: "Unauthorized" }
    }

    const guides = await db
      .select()
      .from(styleGuides)
      .where(eq(styleGuides.status, "pending_review"))

    return { success: true, data: guides as StyleGuide[] }
  } catch (error) {
    console.error("Failed to get pending guides:", error)
    return { success: false, error: "Failed to load pending guides." }
  }
}

export async function getAllGuides(): Promise<ActionResult<StyleGuide[]>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const adminEmail = getAdminEmail()
    if (!adminEmail || session.user.email !== adminEmail) {
      return { success: false, error: "Unauthorized" }
    }

    const guides = await db
      .select()
      .from(styleGuides)

    return { success: true, data: guides as StyleGuide[] }
  } catch (error) {
    console.error("Failed to get all guides:", error)
    return { success: false, error: "Failed to load guides." }
  }
}

export async function approveGuide(
  guideId: string,
  notes?: string
): Promise<ActionResult<{ delivered: boolean }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const adminEmail = getAdminEmail()
    if (!adminEmail || session.user.email !== adminEmail) {
      return { success: false, error: "Unauthorized" }
    }

    // Update guide status to delivered
    await db
      .update(styleGuides)
      .set({
        status: "delivered",
        founderNotes: notes || null,
        reviewedAt: new Date(),
        deliveredAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(styleGuides.id, guideId))

    // Try to send email notification
    try {
      const guide = await db
        .select()
        .from(styleGuides)
        .where(eq(styleGuides.id, guideId))
        .limit(1)

      if (guide.length > 0) {
        const userResult = await db.query.users.findFirst({
          where: (users, { eq: eqOp }) => eqOp(users.id, guide[0].userId),
        })

        if (userResult?.email) {
          const resend = getResend()
          const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@fitted.style"
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fitted.style"

          await resend.emails.send({
            from: `Fitted <${fromEmail}>`,
            to: userResult.email,
            subject: "Your Fitted Style Guide is Ready",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="font-size: 28px; color: #171717; font-weight: 600; margin-bottom: 16px;">Your style guide is ready.</h1>
                <p style="color: #525252; line-height: 1.6; font-size: 16px; margin-bottom: 24px;">
                  Great news — your personalized style guide has been reviewed and approved by our stylist. 
                  It's ready for you to explore.
                </p>
                <a href="${appUrl}/guide" style="display: inline-block; padding: 14px 28px; background: #171717; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
                  View Your Style Guide
                </a>
                <p style="color: #a3a3a3; font-size: 13px; margin-top: 32px; line-height: 1.5;">
                  If you have any questions about your guide, simply reply to this email.
                </p>
              </div>
            `,
          })

          await db
            .update(styleGuides)
            .set({ emailSentAt: new Date(), updatedAt: new Date() })
            .where(eq(styleGuides.id, guideId))
        }
      }
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      // Don't fail the approval just because email failed
    }

    return { success: true, data: { delivered: true } }
  } catch (error) {
    console.error("Failed to approve guide:", error)
    return { success: false, error: "Failed to approve guide." }
  }
}

export async function rejectGuide(
  guideId: string,
  notes: string
): Promise<ActionResult<{ rejected: boolean }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const adminEmail = getAdminEmail()
    if (!adminEmail || session.user.email !== adminEmail) {
      return { success: false, error: "Unauthorized" }
    }

    await db
      .update(styleGuides)
      .set({
        status: "rejected",
        founderNotes: notes,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(styleGuides.id, guideId))

    return { success: true, data: { rejected: true } }
  } catch (error) {
    console.error("Failed to reject guide:", error)
    return { success: false, error: "Failed to reject guide." }
  }
}