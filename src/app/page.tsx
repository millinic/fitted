import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { GUIDE_PRICE_DISPLAY } from "@/lib/constants"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 lg:py-40">
            <div className="max-w-3xl">
              <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-4">
                Personal Style, Simplified
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-950 leading-[1.1] mb-6">
                Dress better without
                <br />
                <span className="text-accent-600">becoming a fashion person</span>
              </h1>
              <p className="text-lg sm:text-xl text-brand-600 max-w-2xl mb-10 leading-relaxed">
                Complete a 10-minute style assessment and receive a personalized wardrobe guide
                with specific product recommendations — curated by an expert stylist,
                tailored to your body, lifestyle, and budget.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/assessment"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-brand-950 text-brand-50 rounded-xl hover:bg-brand-800 transition-colors duration-200"
                >
                  Take the Style Assessment
                </Link>
                <span className="text-sm text-brand-500 self-center">
                  Free assessment · Guide for {GUIDE_PRICE_DISPLAY}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-100/50 to-transparent pointer-events-none hidden lg:block" />
        </section>

        {/* Social Proof */}
        <section className="border-y border-brand-200 bg-white/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
              <div>
                <p className="text-3xl font-serif font-bold text-brand-950">10 min</p>
                <p className="text-sm text-brand-500 mt-1">Assessment time</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-brand-200" />
              <div>
                <p className="text-3xl font-serif font-bold text-brand-950">Expert</p>
                <p className="text-sm text-brand-500 mt-1">Human-reviewed guides</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-brand-200" />
              <div>
                <p className="text-3xl font-serif font-bold text-brand-950">1–3 days</p>
                <p className="text-sm text-brand-500 mt-1">Guide delivery</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white border-b border-brand-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
            <div className="text-center mb-16">
              <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-3">
                How It Works
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
                Three steps to a better wardrobe
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
              {[
                {
                  step: "01",
                  title: "Tell us about you",
                  description:
                    "Complete a detailed style assessment covering your measurements, lifestyle, preferences, and goals. Takes under 10 minutes.",
                },
                {
                  step: "02",
                  title: "Get your style profile",
                  description:
                    "Receive a personalized style profile summary that captures your aesthetic — free before you commit.",
                },
                {
                  step: "03",
                  title: "Receive your guide",
                  description:
                    "Unlock your full personalized style guide with specific product recommendations, purchase links, and styling references.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center sm:text-left">
                  <span className="inline-block text-4xl font-serif font-bold text-brand-200 mb-4">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold text-brand-950 mb-2">{item.title}</h3>
                  <p className="text-brand-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-3">
              What&apos;s Inside
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
              Your guide, tailored to you
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
                title: "Product Recommendations",
                description: "Specific, purchasable items selected for your body, budget, and aesthetic — not generic lists.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                ),
                title: "Purchase Links",
                description: "Direct links to every recommended item so you can buy without any extra research.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                ),
                title: "Outfit Combinations",
                description: "Pre-styled outfits showing how to combine your recommended items for different contexts.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Expert Reasoning",
                description: "A concise explanation for every recommendation so you understand why each piece works for you.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                title: "Color Palette",
                description: "A curated color palette based on your preferences and what works for your complexion and style goals.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Human-Reviewed",
                description: "Every guide is personally reviewed by our expert stylist before it reaches you. No fully automated output.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-brand-200 p-6 hover:border-brand-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-100 text-accent-700 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-brand-950 mb-2">{feature.title}</h3>
                <p className="text-sm text-brand-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Value Proposition */}
        <section className="bg-white border-y border-brand-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-3">
                  Why Fitted
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 mb-6">
                  Like hiring an interior designer — for your closet
                </h2>
                <p className="text-brand-600 text-lg leading-relaxed mb-8">
                  You don&apos;t need to develop taste. You need to borrow an expert&apos;s eye to
                  achieve an outcome you couldn&apos;t reach alone. We combine deep style expertise
                  with AI to deliver genuinely personalized recommendations.
                </p>
                <ul className="space-y-4">
                  {[
                    "Specific product recommendations with purchase links",
                    "Expert reasoning behind every suggestion",
                    "Tailored to your body, budget, and lifestyle",
                    "Reviewed by a human stylist before delivery",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-brand-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-brand-100 rounded-2xl p-8 sm:p-12 border border-brand-200">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-brand-500 mb-1">Personal Stylist</p>
                    <p className="text-2xl font-serif font-bold text-brand-400 line-through">$300–$500+</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-500 mb-1">Fitted Style Guide</p>
                    <p className="text-4xl font-serif font-bold text-brand-950">{GUIDE_PRICE_DISPLAY}</p>
                    <p className="text-sm text-brand-600 mt-1">One-time purchase · No subscription</p>
                  </div>
                  <hr className="border-brand-200" />
                  <p className="text-brand-600 text-sm leading-relaxed">
                    Every guide is reviewed by our expert stylist before delivery.
                    You&apos;ll receive your personalized style guide within 1–3 business days.
                  </p>
                  <Link
                    href="/assessment"
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium bg-brand-950 text-brand-50 rounded-xl hover:bg-brand-800 transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-3">
                FAQ
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
                Common questions
              </h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  q: "How is this different from browsing Pinterest or asking ChatGPT?",
                  a: "Generic AI gives generic answers. Fitted is powered by a curated knowledge base built by an expert stylist — with specific aesthetic principles, brand knowledge, and fit expertise. Every guide is also human-reviewed before delivery.",
                },
                {
                  q: "How long does the assessment take?",
                  a: "Under 10 minutes. We ask about your measurements, lifestyle, preferences, and goals. No photo uploads required.",
                },
                {
                  q: "When do I receive my guide?",
                  a: "Your guide is AI-generated immediately after payment, then personally reviewed by our stylist. You'll receive it within 1–3 business days.",
                },
                {
                  q: "What if I don't like the recommendations?",
                  a: "Every item is selected based on your specific inputs. If something doesn't feel right, reach out — we're here to help.",
                },
                {
                  q: "Is this a subscription?",
                  a: "No. It's a one-time purchase. You pay once and receive your complete personalized style guide.",
                },
                {
                  q: "What budget range do you recommend for?",
                  a: "We accommodate budgets from $50–$150 per item up to $500+. Your guide will respect whatever range you specify during the assessment.",
                },
              ].map((faq) => (
                <div key={faq.q} className="border-b border-brand-200 pb-6">
                  <h3 className="font-semibold text-brand-950 mb-2">{faq.q}</h3>
                  <p className="text-brand-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-950 text-brand-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              Ready to upgrade your wardrobe?
            </h2>
            <p className="text-brand-300 text-lg mb-8 max-w-xl mx-auto">
              Take the free style assessment and see your personalized style profile
              before you commit.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-brand-50 text-brand-950 rounded-xl hover:bg-brand-200 transition-colors duration-200"
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