"use client"

import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import type { StyleGuideContent } from "@/lib/db/schema"

interface GuideDisplayProps {
  guide: {
    id: string
    content: StyleGuideContent
    createdAt: Date
  }
  userName?: string
}

export function GuideDisplay({ guide, userName }: GuideDisplayProps) {
  const { content } = guide
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null)
  const [feedbackPersonalized, setFeedbackPersonalized] = useState<boolean | null>(null)
  const [feedbackComments, setFeedbackComments] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)

  async function submitFeedback() {
    if (feedbackRating === null) return
    setFeedbackSubmitting(true)
    try {
      const res = await fetch("/api/guide/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guideId: guide.id,
          overallRating: feedbackRating,
          feltPersonalized: feedbackPersonalized,
          comments: feedbackComments || null,
        }),
      })
      if (res.ok) {
        setFeedbackSubmitted(true)
      }
    } catch {
      // Silently fail feedback
    } finally {
      setFeedbackSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-medium tracking-widest uppercase text-accent-600 mb-3">
          Your Personal Style Guide
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-950 mb-4">
          {userName ? `${userName}'s` : "Your"} Wardrobe Guide
        </h1>
        <p className="text-brand-600 max-w-2xl mx-auto text-lg leading-relaxed">
          {content.introduction}
        </p>
      </div>

      {/* Product Sections */}
      {content.sections.map((section, sIdx) => (
        <div key={sIdx} className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-brand-950 mb-6 pb-3 border-b border-brand-200">
            {section.category}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items.map((item, iIdx) => (
              <Card key={iIdx} padding="md" className="flex flex-col h-full">
                {item.imageUrl && (
                  <div className="w-full h-48 bg-brand-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-brand-950">{item.name}</h3>
                      <p className="text-sm text-accent-600 font-medium">{item.brand}</p>
                    </div>
                    <span className="text-sm font-medium text-brand-500 whitespace-nowrap">
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-sm text-brand-700 mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="bg-brand-50 rounded-md px-3 py-2 mb-4">
                    <p className="text-xs text-brand-600 italic">
                      <span className="font-medium text-brand-700 not-italic">Why this:</span>{" "}
                      {item.reasoning}
                    </p>
                  </div>
                  <div className="mt-auto">
                    {item.purchaseUrl && item.purchaseUrl !== "https://example.com" && (
                      <a
                        href={item.affiliateUrl || item.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium border-2 border-brand-950 text-brand-950 rounded-lg hover:bg-brand-950 hover:text-brand-50 transition-colors"
                      >
                        Shop Now
                        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Lookbooks */}
      {content.lookbooks && content.lookbooks.length > 0 && (
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-brand-950 mb-6 pb-3 border-b border-brand-200">
            Outfit Combinations
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {content.lookbooks.map((look, idx) => (
              <Card key={idx} padding="md">
                <h3 className="font-semibold text-brand-950 mb-2">{look.title}</h3>
                <p className="text-sm text-brand-700 leading-relaxed">{look.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Section */}
      <div className="bg-brand-100/50 rounded-xl p-6 sm:p-8 border border-brand-200">
        {feedbackSubmitted ? (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-accent-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-serif text-lg font-semibold text-brand-950 mb-1">
              Thank you for your feedback!
            </p>
            <p className="text-brand-600 text-sm">
              It helps us improve our recommendations.
            </p>
          </div>
        ) : feedbackOpen ? (
          <div>
            <h3 className="font-serif text-lg font-semibold text-brand-950 mb-4">
              How was your experience?
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-brand-700 mb-2">
                  Overall rating
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 transition-colors ${
                          feedbackRating && star <= feedbackRating
                            ? "text-accent-500"
                            : "text-brand-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-brand-700 mb-2">
                  Did the guide feel personalized to you?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFeedbackPersonalized(true)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      feedbackPersonalized === true
                        ? "border-brand-950 bg-brand-950 text-white"
                        : "border-brand-200 text-brand-700 hover:border-brand-400"
                    }`}
                  >
                    Yes, definitely
                  </button>
                  <button
                    onClick={() => setFeedbackPersonalized(false)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      feedbackPersonalized === false
                        ? "border-brand-950 bg-brand-950 text-white"
                        : "border-brand-200 text-brand-700 hover:border-brand-400"
                    }`}
                  >
                    Could be better
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-brand-700 mb-2">
                  Any additional comments? (optional)
                </p>
                <textarea
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                  rows={3}
                  placeholder="Tell us what you liked or what we could improve..."
                  className="w-full px-4 py-3 rounded-lg border border-brand-300 bg-white text-brand-950 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none text-sm"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={submitFeedback}
                  loading={feedbackSubmitting}
                  disabled={feedbackRating === null}
                >
                  Submit Feedback
                </Button>
                <Button variant="ghost" onClick={() => setFeedbackOpen(false)}>
                  Skip
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-serif text-lg font-semibold text-brand-950 mb-2">
              How was your guide?
            </p>
            <p className="text-brand-600 text-sm mb-4">
              Your feedback helps us make better recommendations.
            </p>
            <Button variant="outline" size="sm" onClick={() => setFeedbackOpen(true)}>
              Leave Feedback
            </Button>
          </div>
        )}
      </div>

      {/* Contact Note */}
      <div className="mt-8 text-center">
        <p className="text-brand-600 text-sm">
          Questions about your guide? Every item was selected specifically for you.
          Reach out if you&apos;d like to discuss any recommendations.
        </p>
      </div>
    </div>
  )
}