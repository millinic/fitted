import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import {
  APP_NAME,
  GUIDE_PRICE_DISPLAY,
  ESTIMATED_DELIVERY_DAYS,
} from "@/lib/constants"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-brand-600 mb-6">
              Personalized Men&apos;s Style
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-neutral-900 leading-[1.1] tracking-tight">
              Your Personal Style,
              <br />
              <span className="italic text-brand-700">Expertly Curated</span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Stop guessing. Get a personalized wardrobe guide built by a style expert —
              specific product recommendations, styling direction, and purchase links.
              All tailored to you.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center h-13 px-8 text-base font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                Start Your Style Assessment
              </Link>
              <span className="text-sm text-neutral-500">
                10-minute assessment · {GUIDE_PRICE_DISPLAY} one-time
              </span>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-neutral-200/60">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "10 min", label: "Assessment" },
                { value: "20+", label: "Product Picks" },
                { value: "Expert", label: "Reviewed" },
                { value: ESTIMATED_DELIVERY_DAYS, label: "Delivery" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-2xl font-semibold text-neutral-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-brand-600 mb-4">
                How It Works
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900">
                Three steps to a better wardrobe
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: "01",
                  title: "Tell Us About You",
                  description:
                    "Complete a detailed style assessment covering your measurements, lifestyle, preferences, and goals. Under 10 minutes.",
                },
                {
                  step: "02",
                  title: "Get Your Style Profile",
                  description:
                    "Our AI, trained on expert style philosophy, generates a personalized style profile — your aesthetic archetype, principles, and direction.",
                },
                {
                  step: "03",
                  title: "Receive Your Guide",
                  description:
                    "Get a comprehensive style guide with specific product recommendations, purchase links, and lookbook combinations. Reviewed by our stylist.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center md:text-left">
                  <span className="inline-block text-xs font-mono font-medium text-brand-500 mb-3 tracking-wider">
                    {item.step}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-brand-600 mb-4">
                Built For You
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900">
                Sound familiar?
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "You have the money to dress well, but not the eye",
                "You're surrounded by people with taste and want to close the gap",
                "You don't want fashion to become a hobby — you just want results",
                "You trust personal recommendations over Instagram trends",
                "You want to look put-together without overthinking it",
                "You'd hire an interior designer — why not a style consultant?",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-5 rounded-xl border border-neutral-200 bg-white"
                >
                  <svg
                    className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm text-neutral-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900">
                Not another fashion algorithm
              </h2>
              <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
                Like hiring an interior designer for your wardrobe — you don&apos;t need to
                develop taste, you just need to borrow an expert&apos;s eye.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {[
                {
                  title: "Genuinely Personalized",
                  description:
                    "Not a quiz that puts you in a box. Your guide considers your body, lifestyle, goals, budget, and aesthetic sensibility.",
                },
                {
                  title: "Expert-Reviewed",
                  description:
                    "Every guide is reviewed by our stylist before delivery. AI generates, humans quality-check.",
                },
                {
                  title: "Ready to Shop",
                  description:
                    "Specific product recommendations with purchase links. No guesswork, no endless browsing.",
                },
                {
                  title: "Timeless, Not Trendy",
                  description:
                    "Rooted in quality and timelessness. We reference trends only when they serve your personal style.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-xl border border-neutral-200 bg-brand-50"
                >
                  <h3 className="font-medium text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-brand-600 mb-4">
              Simple Pricing
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 mb-8">
              One guide. One price.
            </h2>

            <div className="p-8 rounded-2xl border border-neutral-200 bg-white">
              <p className="font-serif text-5xl font-semibold text-neutral-900">
                {GUIDE_PRICE_DISPLAY}
              </p>
              <p className="text-sm text-neutral-500 mt-2">One-time purchase</p>

              <ul className="mt-8 space-y-3 text-sm text-neutral-700 text-left max-w-sm mx-auto">
                {[
                  "Personalized style profile & archetype",
                  "20+ specific product recommendations",
                  "Purchase links for every item",
                  "Lookbook styling combinations",
                  "Expert-reviewed before delivery",
                  `Delivered within ${ESTIMATED_DELIVERY_DAYS}`,
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-brand-700 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/assessment"
                className="mt-8 inline-flex items-center justify-center h-13 px-8 text-base font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors w-full sm:w-auto"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 mb-4">
              Ready to dress like you mean it?
            </h2>
            <p className="text-neutral-600 mb-8">
              The style assessment takes under 10 minutes. Your guide arrives within{" "}
              {ESTIMATED_DELIVERY_DAYS}.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center h-13 px-8 text-base font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
            >
              Start Your Assessment
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}