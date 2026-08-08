import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { payments, styleGuides } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Stripe from "stripe"

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session

    if (checkoutSession.payment_status === "paid") {
      const userId = checkoutSession.metadata?.userId
      const assessmentId = checkoutSession.metadata?.assessmentId

      if (userId && assessmentId) {
        const updatedPayments = await db
          .update(payments)
          .set({
            status: "completed",
            stripePaymentIntentId: checkoutSession.payment_intent as string,
            updatedAt: new Date(),
          })
          .where(eq(payments.stripeSessionId, checkoutSession.id))
          .returning({ id: payments.id })

        const paymentId = updatedPayments[0]?.id

        if (paymentId) {
          const existingGuides = await db
            .select()
            .from(styleGuides)
            .where(eq(styleGuides.assessmentId, assessmentId))
            .limit(1)

          if (!existingGuides[0]) {
            await db.insert(styleGuides).values({
              userId,
              assessmentId,
              paymentId,
              status: "pending_generation",
            })
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}