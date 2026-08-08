import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { GUIDE_PRICE_DISPLAY, BRAND_TIERS } from "@/lib/constants"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
            <div className="max-w-3xl">
              <p className="text-sm font-medium tracking-widest uppercase text-brand-600 mb-4">
                Personal Style Guide
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-neutral-900 leading-tight">
                Dress better without{" "}
                <span className="text-brand-600">becoming a fashion person</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl">
                A personalized wardrobe guide curated by an expert stylist — specific product
                recommendations, purchase links, and styling advice tailored to your body, budget,
                and lifestyle.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/assessment"
                  className="inline-flex items-center justify-center bg-neutral-900 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-neutral-800 transition-colors"
                >
                  Take the Style Assessment
                </Link>
                <p className="text-sm text-neutral-500 self-center">
                  Free assessment · Guide for {GUIDE_PRICE_DISPLAY}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-100/40 to-transparent pointer-events-none hidden lg:block" />
        </section>

        {/* How It Works */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="text-center mb-16">
              <p className="text-sm font-medium tracking-widest uppercase text-brand-600 mb-3">
                How It Works
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900">
                Three steps to your best wardrobe
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {[
                {
                  step: "01",
                  title: "Take the Assessment",
                  description:
                    "Answer questions about your measurements, lifestyle, preferences, and budget. Takes under 10 minutes.",
                },
                {
                  step: "02",
                  title: "Get Your Style Profile",
                  description:
                    "See a personalized summary of your style identity — your archetype, ideal color palette, and brand matches.",
                },
                {
                  step: "03",
                  title: "Receive Your Guide",
                  description:
                    "Get a comprehensive style guide with 15-20 specific product recommendations, styling lookbooks, and expert advice.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-100 text-brand-700 font-serif text-xl font-semibold mb-5">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-serif text-neutral-900 mb-3">{item.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials Placeholder */}
        <section className="bg-brand-50 border-y border-brand-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { stat: "10 min", label: "Assessment time" },
                { stat: "15-20", label: "Personalized recommendations" },
                { stat: "Expert", label: "Stylist-reviewed guides" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-3xl font-serif font-semibold text-neutral-900">{item.stat}</p>
                  <p className="text-sm text-neutral-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Prop */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-sm font-medium tracking-widest uppercase text-brand-600 mb-3">
                  Why Fitted
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900 mb-6">
                  Like hiring a personal stylist — without the price tag
                </h2>
                <div className="space-y-5 text-neutral-600 leading-relaxed">
                  <p>
                    You don&apos;t want to become a fashion expert. You want to look like you already
                    are one. Fitted gives you the outcome of a personal styling session — specific
                    recommendations, clear reasoning, and a cohesive wardrobe plan — for a fraction
                    of the cost.
                  </p>
                  <p>
                    Every guide is reviewed by our founder stylist to ensure the recommendations are
                    genuinely excellent, not generic. No algorithms guessing. No sponsored picks.
                    Just honest, expert-curated style advice tailored to you.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { icon: "✦", text: "Timeless over trendy" },
                    { icon: "✦", text: "Fit-first approach" },
                    { icon: "✦", text: "Quality over quantity" },
                    { icon: "✦", text: "For your real life" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 text-sm text-neutral-700">
                      <span className="text-brand-500">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-brand-50 rounded-2xl p-8 shadow-sm border border-brand-100">
                <h3 className="font-serif text-xl text-neutral-900 mb-6">What&apos;s included</h3>
                <ul className="space-y-4">
                  {[
                    "15-20 personalized product recommendations",
                    "Specific brands and items for your budget",
                    "4-5 complete outfit lookbooks",
                    "Expert reasoning for every pick",
                    "Color palette tailored to you",
                    "Fit advice for your body type",
                    "Reviewed by our founder stylist",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-success shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-brand-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-semibold text-neutral-900">
                      {GUIDE_PRICE_DISPLAY}
                    </span>
                    <span className="text-neutral-500">one-time</span>
                  </div>
                  <Link
                    href="/assessment"
                    className="mt-4 w-full inline-flex items-center justify-center bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Start Your Assessment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="bg-brand-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="text-center mb-16">
              <p className="text-sm font-medium tracking-widest uppercase text-brand-600 mb-3">
                Built For You
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900">
                Fitted is for men who…
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: "Have the budget, not the eye",
                  desc: "You can afford good clothes — you just don't know which ones to buy.",
                },
                {
                  title: "Don't want a new hobby",
                  desc: "You don't want to follow fashion accounts or spend weekends shopping. You want it handled.",
                },
                {
                  title: "Are surrounded by style",
                  desc: "Your friends and colleagues dress well. You want to close the gap without making it a project.",
                },
                {
                  title: "Trust experts, not algorithms",
                  desc: "You'd rather get advice from someone with genuine taste than an app suggesting random items.",
                },
                {
                  title: "Value quality and timelessness",
                  desc: "You want pieces that last — in both construction and style. No fast fashion.",
                },
                {
                  title: "Want to feel confident daily",
                  desc: "Not just for special occasions. You want to look put-together every single day.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-6 border border-brand-100"
                >
                  <h3 className="font-serif text-lg text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="text-center mb-12">
              <p className="text-sm font-medium tracking-widest uppercase text-brand-600 mb-3">
                Curated From
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900">
                Brands we know and trust
              </h2>
              <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
                Recommendations span from accessible everyday brands to premium investment pieces,
                always matched to your budget.
              </p>
            </div>

            <div className="space-y-8 max-w-4xl mx-auto">
              {([
                { label: "Accessible", brands: BRAND_TIERS.accessible },
                { label: "Premium", brands: BRAND_TIERS.premium },
                { label: "Luxury", brands: BRAND_TIERS.luxury },
              ] as const).map((tier) => (
                <div key={tier.label}>
                  <p className="text-xs font-medium tracking-widest uppercase text-neutral-400 mb-3">
                    {tier.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tier.brands.map((brand) => (
                      <span
                        key={brand}
                        className="px-4 py-2 bg-brand-50 text-neutral-700 rounded-full text-sm font-medium border border-brand-100"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-brand-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900">
                Frequently asked questions
              </h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  q: "How long does the assessment take?",
                  a: "Under 10 minutes. We ask about your measurements, lifestyle, preferences, and budget — everything we need to create a genuinely personalized guide.",
                },
                {
                  q: "When will I receive my guide?",
                  a: "Your guide is generated immediately after purchase, then reviewed by our founder stylist within 1-3 business days to ensure quality. You'll receive an email when it's ready.",
                },
                {
                  q: "What exactly do I get?",
                  a: "15-20 specific product recommendations with brand names and price ranges, 4-5 complete outfit lookbooks, a personalized color palette, fit advice for your body type, and general styling guidance — all tailored to your lifestyle and budget.",
                },
                {
                  q: "Is the assessment free?",
                  a: "Yes. The assessment and your style profile summary are completely free. You only pay when you're ready to unlock your full personalized style guide.",
                },
                {
                  q: "Can I get a refund?",
                  a: "If you feel your guide didn't meet the standard of a personalized styling consultation, reach out within 7 days and we'll make it right.",
                },
                {
                  q: "Will the recommendations actually fit me?",
                  a: "We factor in your exact measurements, body type, fit preferences, and which brands already fit you well. Every recommendation is calibrated to your proportions.",
                },
              ].map((faq) => (
                <div key={faq.q} className="bg-white rounded-xl p-6 border border-brand-100">
                  <h3 className="font-serif text-lg text-neutral-900 mb-2">{faq.q}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-neutral-900 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
            <h2 className="text-3xl sm:text-4xl font-serif mb-4">
              Ready to upgrade your wardrobe?
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
              Take the free style assessment and see your personalized style profile in minutes.
              No commitment required.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center bg-white text-neutral-900 px-8 py-4 rounded-xl text-lg font-medium hover:bg-neutral-100 transition-colors"
            >
              Get Started — It&apos;s Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}