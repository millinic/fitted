"use client"

import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import type { GuideStatus } from "@/types"
import type { StyleGuideContent } from "@/lib/db/schema"

interface FeedbackData {
  id: string
  overallRating: number | null
  feltPersonalized: boolean | null
  comments: string | null
  createdAt: Date
}

interface AssessmentData {
  id: string
  height: string | null
  bodyType: string | null
  fitPreference: string | null
  waistSize: number | null
  chestSize: number | null
  inseam: number | null
  typicalShirtSize: string | null
  typicalPantSize: string | null
  shoeSize: string | null
  brandsLiked: string[] | null
  brandFitReferences: string[] | null
  lifestyleContext: string[] | null
  styleGoals: string[] | null
  styleReferences: string[] | null
  colorPreferences: string[] | null
  wardrobeGaps: string[] | null
  budgetRange: string | null
  shoppingBehavior: string | null
  [key: string]: unknown
}

interface GuideData {
  guideId: string
  userId: string
  assessmentId: string
  status: GuideStatus
  guideContent: StyleGuideContent | null
  founderNotes: string | null
  createdAt: Date
  reviewedAt: Date | null
  deliveredAt: Date | null
  userName: string | null
  userEmail: string | null
  assessment: AssessmentData | null
  feedback: FeedbackData[]
}

interface AdminStats {
  totalGuides: number
  pendingReviewCount: number
  completedCount: number
  avgRating: number
  personalizedRate: number
  totalFeedback: number
}

interface AdminDashboardProps {
  guides: GuideData[]
  stats: AdminStats
}

const HIDDEN_ASSESSMENT_KEYS = new Set([
  "id", "userId", "createdAt", "updatedAt", "completedAt",
])

function formatAssessmentKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
}

function formatAssessmentValue(value: unknown): string {
  if (value === null || value === undefined) return "—"
  if (Array.isArray(value)) return value.join(", ")
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

export function AdminDashboard({ guides, stats }: AdminDashboardProps) {
  const [selectedGuide, setSelectedGuide] = useState<GuideData | null>(null)
  const [notes, setNotes] = useState("")
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"review" | "completed" | "feedback">("review")

  const pendingReview = guides.filter((g) => g.status === "pending_review")
  const approved = guides.filter((g) => g.status === "approved" || g.status === "delivered")
  const other = guides.filter(
    (g) =>
      g.status !== "pending_review" &&
      g.status !== "approved" &&
      g.status !== "delivered"
  )
  const allFeedback = guides.flatMap((g) =>
    g.feedback.map((f) => ({ ...f, userName: g.userName, userEmail: g.userEmail }))
  )

  async function handleAction(guideId: string, action: "approve" | "request_revision") {
    setProcessing(true)
    setMessage(null)

    try {
      const res = await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guideId, action, notes }),
      })

      if (!res.ok) {
        throw new Error("Failed to process review action")
      }

      setMessage(
        action === "approve"
          ? "Guide approved and delivery email sent."
          : "Revision requested."
      )
      setSelectedGuide(null)
      setNotes("")

      window.location.reload()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error processing action")
    } finally {
      setProcessing(false)
    }
  }

  function getStatusBadge(status: GuideStatus) {
    const colors: Record<GuideStatus, string> = {
      pending_generation: "bg-gray-100 text-gray-700",
      generating: "bg-blue-100 text-blue-700",
      pending_review: "bg-yellow-100 text-yellow-700",
      revision_requested: "bg-orange-100 text-orange-700",
      approved: "bg-green-100 text-green-700",
      delivered: "bg-brand-100 text-brand-700",
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.replace(/_/g, " ")}
      </span>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-950 mb-2">
          Founder Dashboard
        </h1>
        <p className="text-brand-600">
          {stats.pendingReviewCount} guide{stats.pendingReviewCount !== 1 ? "s" : ""} pending review · {stats.totalGuides} total
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card padding="sm">
          <p className="text-xs text-brand-500 mb-1">Total Guides</p>
          <p className="text-2xl font-serif font-bold text-brand-950">{stats.totalGuides}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-brand-500 mb-1">Pending Review</p>
          <p className="text-2xl font-serif font-bold text-yellow-600">{stats.pendingReviewCount}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-brand-500 mb-1">Avg Rating</p>
          <p className="text-2xl font-serif font-bold text-brand-950">
            {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-brand-500 mb-1">Felt Personalized</p>
          <p className="text-2xl font-serif font-bold text-brand-950">
            {stats.personalizedRate > 0 ? `${Math.round(stats.personalizedRate)}%` : "—"}
          </p>
        </Card>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-accent-100 border border-accent-200 rounded-lg text-sm text-accent-800">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-brand-200">
        {[
          { id: "review" as const, label: `Review Queue (${pendingReview.length + other.length})` },
          { id: "completed" as const, label: `Completed (${approved.length})` },
          { id: "feedback" as const, label: `Feedback (${allFeedback.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-brand-950 text-brand-950"
                : "border-transparent text-brand-500 hover:text-brand-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review Tab */}
      {activeTab === "review" && (
        <div className="space-y-4">
          {pendingReview.length === 0 && other.length === 0 ? (
            <Card padding="lg" className="text-center">
              <p className="text-brand-500">No guides pending review.</p>
            </Card>
          ) : (
            <>
              {pendingReview.map((guide) => (
                <Card key={guide.guideId} padding="md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-brand-950">
                          {guide.userName || "Anonymous"}
                        </h3>
                        {getStatusBadge(guide.status)}
                      </div>
                      <p className="text-sm text-brand-600">{guide.userEmail}</p>
                      <p className="text-xs text-brand-500 mt-1">
                        Submitted {new Date(guide.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedGuide(guide)
                        setNotes(guide.founderNotes || "")
                      }}
                    >
                      Review
                    </Button>
                  </div>
                </Card>
              ))}
              {other.map((guide) => (
                <Card key={guide.guideId} padding="sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-brand-800">
                        {guide.userName || "Anonymous"}
                      </span>
                      {getStatusBadge(guide.status)}
                    </div>
                    <span className="text-xs text-brand-500">
                      {new Date(guide.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {/* Completed Tab */}
      {activeTab === "completed" && (
        <div className="space-y-3">
          {approved.length === 0 ? (
            <Card padding="lg" className="text-center">
              <p className="text-brand-500">No completed guides yet.</p>
            </Card>
          ) : (
            approved.map((guide) => (
              <Card key={guide.guideId} padding="sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-brand-800">
                      {guide.userName || "Anonymous"}
                    </span>
                    <span className="text-xs text-brand-500">{guide.userEmail}</span>
                    {getStatusBadge(guide.status)}
                  </div>
                  <span className="text-xs text-brand-500">
                    {guide.deliveredAt
                      ? `Delivered ${new Date(guide.deliveredAt).toLocaleDateString()}`
                      : guide.reviewedAt
                        ? `Approved ${new Date(guide.reviewedAt).toLocaleDateString()}`
                        : ""}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === "feedback" && (
        <div className="space-y-4">
          {allFeedback.length === 0 ? (
            <Card padding="lg" className="text-center">
              <p className="text-brand-500">No feedback received yet.</p>
            </Card>
          ) : (
            allFeedback.map((f) => (
              <Card key={f.id} padding="md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-brand-800">
                        {f.userName || "Anonymous"}
                      </span>
                      {f.overallRating && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= f.overallRating! ? "text-accent-500" : "text-brand-200"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                      {f.feltPersonalized !== null && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            f.feltPersonalized
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {f.feltPersonalized ? "Felt personalized" : "Needs improvement"}
                        </span>
                      )}
                    </div>
                    {f.comments && (
                      <p className="text-sm text-brand-700 italic">&ldquo;{f.comments}&rdquo;</p>
                    )}
                  </div>
                  <span className="text-xs text-brand-500 whitespace-nowrap">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Review Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-brand-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-950">
                  Review: {selectedGuide.userName || "Anonymous"}
                </h3>
                <p className="text-sm text-brand-600">{selectedGuide.userEmail}</p>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="text-brand-500 hover:text-brand-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6">
              {/* Assessment Summary */}
              {selectedGuide.assessment && (
                <div className="mb-8">
                  <h4 className="font-semibold text-brand-950 mb-3">Assessment Summary</h4>
                  <div className="bg-brand-50 rounded-lg p-4 text-sm text-brand-700 space-y-1">
                    {Object.entries(selectedGuide.assessment).map(([key, value]) => {
                      if (HIDDEN_ASSESSMENT_KEYS.has(key) || value === null || value === undefined) {
                        return null
                      }
                      return (
                        <p key={key}>
                          <span className="font-medium text-brand-900">
                            {formatAssessmentKey(key)}:
                          </span>{" "}
                          {formatAssessmentValue(value)}
                        </p>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Guide Content Preview */}
              {selectedGuide.guideContent && (
                <div className="mb-8">
                  <h4 className="font-semibold text-brand-950 mb-3">Generated Guide Content</h4>
                  <div className="bg-brand-50 rounded-lg p-4 space-y-4">
                    <p className="text-sm text-brand-700 italic">
                      {selectedGuide.guideContent.introduction}
                    </p>
                    {selectedGuide.guideContent.sections.map((section, idx) => (
                      <div key={idx}>
                        <h5 className="text-sm font-semibold text-brand-900 mb-2">
                          {section.category}
                        </h5>
                        <div className="space-y-2">
                          {section.items.map((item, iIdx) => (
                            <div key={iIdx} className="text-sm text-brand-700 pl-4 border-l-2 border-brand-200">
                              <p className="font-medium text-brand-800">
                                {item.brand} — {item.name} ({item.priceRange})
                              </p>
                              <p>{item.description}</p>
                              <p className="italic text-brand-500 text-xs mt-0.5">
                                Reasoning: {item.reasoning}
                              </p>
                              {item.purchaseUrl && (
                                <a
                                  href={item.purchaseUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-accent-600 hover:underline"
                                >
                                  {item.purchaseUrl}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {selectedGuide.guideContent.lookbooks &&
                      selectedGuide.guideContent.lookbooks.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-brand-900 mb-2">
                            Lookbook Entries
                          </h5>
                          {selectedGuide.guideContent.lookbooks.map((look, idx) => (
                            <div key={idx} className="text-sm text-brand-700 pl-4 border-l-2 border-accent-200 mb-2">
                              <p className="font-medium text-brand-800">{look.title}</p>
                              <p>{look.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-brand-700 mb-2">
                  Review Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-brand-300 bg-white text-brand-950 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
                  placeholder="Notes about the review, changes needed, etc."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleAction(selectedGuide.guideId, "approve")}
                  loading={processing}
                >
                  Approve & Deliver
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction(selectedGuide.guideId, "request_revision")}
                  loading={processing}
                >
                  Request Revision
                </Button>
                <Button variant="ghost" onClick={() => setSelectedGuide(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}