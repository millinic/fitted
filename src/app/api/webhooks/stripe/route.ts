import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/lib/db"
import { payments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set")
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    console.error("STRIPE_SECRET_KEY not set")
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
  })

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status === "paid" && session.id) {
          await db
            .update(payments)
            .set({
              status: "completed",
              stripePaymentIntentId: session.payment_intent as string,
              updatedAt: new Date(),
            })
            .where(eq(payments.stripeSessionId, session.id))
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        if (paymentIntent.id) {
          await db
            .update(payments)
            .set({
              status: "failed",
              updatedAt: new Date(),
            })
            .where(eq(payments.stripePaymentIntentId, paymentIntent.id))
        }
        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        if (charge.payment_intent) {
          await db
            .update(payments)
            .set({
              status: "refunded",
              updatedAt: new Date(),
            })
            .where(
              eq(
                payments.stripePaymentIntentId,
                charge.payment_intent as string
              )
            )
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}