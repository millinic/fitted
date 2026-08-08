import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { getDb } from "@/lib/db"
import { assessments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { GUIDE_PRICE_CENTS, GUIDE_CURRENCY } from "@/lib/constants"
import { getBaseUrl } from "@/lib/utils"
import type { ApiResponse } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const { assessmentId } = await request.json()

    if (!assessmentId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Assessment ID is required" },
        { status: 400 }
      )
    }

    const db = getDb()
    const assessment = await db.query.assessments.findFirst({
      where: eq(assessments.id, assessmentId),
    })

    if (!assessment) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Assessment not found" },
        { status: 404 }
      )
    }

    const stripe = getStripe()
    const baseUrl = getBaseUrl() || request.nextUrl.origin

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: GUIDE_CURRENCY,
            product_data: {
              name: "Fitted — Personal Style Guide",
              description:
                "Your personalized wardrobe guide with 15-20 product recommendations, outfit lookbooks, and expert styling advice.",
            },
            unit_amount: GUIDE_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: {
        assessmentId,
      },
      customer_email: undefined,
      success_url: `${baseUrl}/guide/generating?session_id={CHECKOUT_SESSION_ID}&assessment_id=${assessmentId}`,
      cancel_url: `${baseUrl}/profile/${assessmentId}`,
    })

    return NextResponse.json<ApiResponse<{ checkoutUrl: string }>>({
      success: true,
      data: { checkoutUrl: session.url! },
    })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || "Failed to create checkout session" },
      { status: 500 }
    )
  }
}