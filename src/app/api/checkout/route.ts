import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { payments } from "@/lib/db/schema"
import Stripe from "stripe"
import { GUIDE_PRICE_CENTS, GUIDE_CURRENCY } from "@/lib/constants"

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" })
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { assessmentId } = await request.json()

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID required" }, { status: 400 })
    }

    const stripe = getStripe()
    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: GUIDE_CURRENCY,
            product_data: {
              name: "Fitted Personal Style Guide",
              description:
                "Your personalized wardrobe guide with specific product recommendations, styling references, and expert reasoning.",
            },
            unit_amount: GUIDE_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/guide/generating?session_id={CHECKOUT_SESSION_ID}&assessment_id=${assessmentId}`,
      cancel_url: `${appUrl}/profile/${assessmentId}`,
      metadata: {
        userId: session.user.id,
        assessmentId,
      },
      customer_email: session.user.email || undefined,
    })

    await db.insert(payments).values({
      userId: session.user.id,
      stripeSessionId: checkoutSession.id,
      amount: GUIDE_PRICE_CENTS,
      currency: GUIDE_CURRENCY,
      status: "pending",
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}