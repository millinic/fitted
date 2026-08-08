"use client"

import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

interface GuideRow {
  guideId: string
  assessmentId: string
  status: string
  createdAt: Date
  founderNotes: string | null
  introduction: string | null
  recommendations: Record<string, unknown>[] | null
  lookbooks: Record<string, unknown>[] | null
  generalAdvice: string | null
  firstName: string | null
  lastName: string | null
  location: string | null
  styleArchetype: string | null
  bodyType: string | null
  fitPreference: string | null
  budgetRange: string | null
  styleGoal: string | null
}

interface AdminStats {
  totalAssessments: number
  totalPayments: number
  pendingReview: number
  totalGuides: number
}

interface AdminDashboardProps {
  guides: GuideRow[]
  stats: AdminStats
}

const STATUS_FILTERS = ["all", "pending_review", "generating", "approved", "delivered", "revision_requested"] as const

const statusColors: Record<string, string> = {
  approved: "bg-green-100 text-green-800",
  delivered: "bg-green-100 text-green-800",
  pending_review: "bg-yellow-100 text-yellow-800",
  generating: "bg-blue-100 text-blue-800",
  revision_requested: "bg-orange-100 text-orange-800",
}

const statusLabels: Record<string, string> = {
  approved: "Approved",
  delivered: "Delivered",
  pending_review: "Pending Review",
  generating: "Generating",
  revision_requested: "Revision Requested",
}

export function AdminDashboard({ guides, stats }: AdminDashboardProps) {
  const [filter, setFilter] = useState<string>("all")
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filteredGuides = filter === "all" ? guides : guides.filter((g) => g.status === filter)

  const handleStatusUpdate = async (guideId: string, newStatus: string, notes?: string) => {
    setActionLoading(guideId)
    try {
      const res = await fetch("/api/admin/guide/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guideId, status: newStatus, founderNotes: notes }),
      })

      if (res.ok) {
        window.location.reload()
      }
    } catch (err) {
      console.error("Failed to update guide status:", err)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="bg-brand-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-serif text-neutral-900 mb-2">Admin Dashboard</h1>
        <p className="text-neutral-600 mb-8">Founder review queue and analytics.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Assessments", value: stats.totalAssessments },
            { label: "Payments", value: stats.totalPayments },
            { label: "Pending Review", value: stats.pendingReview },
            { label: "Total Guides", value: stats.totalGuides },
          ].map((stat) => (
            <Card key={stat.label} variant="bordered" className="text-center py-4">
              <p className="text-2xl font-serif font-semibold text-neutral-900">{stat.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_FILTERS.map((s) => {
            const count = s === "all" ? guides.length : guides.filter((g) => g.status === s).length
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === s
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {s === "all" ? "All" : statusLabels[s] || s} ({count})
              </button>
            )
          })}
        </div>

        {/* Guide List */}
        <div className="space-y-4">
          {filteredGuides.length === 0 ? (
            <Card variant="bordered" className="text-center py-12">
              <p className="text-neutral-500">No guides match this filter.</p>
            </Card>
          ) : (
            filteredGuides.map((guide) => {
              const isExpanded = expandedGuide === guide.guideId
              return (
                <Card key={guide.guideId} variant="bordered">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedGuide(isExpanded ? null : guide.guideId)}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-neutral-900">
                          {guide.firstName || "Unknown"} {guide.lastName || ""}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusColors[guide.status] || "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {statusLabels[guide.status] || guide.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
                        {guide.styleArchetype && <span>{guide.styleArchetype}</span>}
                        {guide.location && <span>{guide.location}</span>}
                        {guide.budgetRange && <span className="capitalize">{guide.budgetRange}</span>}
                        <span>{guide.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-neutral-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-neutral-100 space-y-6">
                      {/* Quick Info */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        {guide.bodyType && (
                          <div>
                            <p className="text-neutral-400">Body Type</p>
                            <p className="text-neutral-800 capitalize">{guide.bodyType}</p>
                          </div>
                        )}
                        {guide.fitPreference && (
                          <div>
                            <p className="text-neutral-400">Fit Preference</p>
                            <p className="text-neutral-800 capitalize">{guide.fitPreference}</p>
                          </div>
                        )}
                        {guide.styleGoal && (
                          <div>
                            <p className="text-neutral-400">Style Goal</p>
                            <p className="text-neutral-800">{guide.styleGoal}</p>
                          </div>
                        )}
                        {guide.budgetRange && (
                          <div>
                            <p className="text-neutral-400">Budget</p>
                            <p className="text-neutral-800 capitalize">{guide.budgetRange}</p>
                          </div>
                        )}
                      </div>

                      {guide.introduction && (
                        <div>
                          <p className="text-sm font-medium text-neutral-700 mb-2">Introduction</p>
                          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-4">
                            {guide.introduction}
                          </p>
                        </div>
                      )}

                      {guide.recommendations && (
                        <p className="text-sm text-neutral-500">
                          {Array.isArray(guide.recommendations)
                            ? `${guide.recommendations.length} recommendations`
                            : "Recommendations available"}
                        </p>
                      )}

                      {guide.founderNotes && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <span className="font-medium">Notes:</span> {guide.founderNotes}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        {guide.status === "pending_review" && (
                          <>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusUpdate(guide.guideId, "approved")
                              }}
                              loading={actionLoading === guide.guideId}
                            >
                              Approve &amp; Deliver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                const notes = prompt("Enter revision notes:")
                                if (notes) {
                                  handleStatusUpdate(guide.guideId, "revision_requested", notes)
                                }
                              }}
                            >
                              Request Revision
                            </Button>
                          </>
                        )}
                        {guide.status === "approved" && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusUpdate(guide.guideId, "delivered")
                            }}
                            loading={actionLoading === guide.guideId}
                          >
                            Mark as Delivered
                          </Button>
                        )}
                        <a
                          href={`/guide/${guide.assessmentId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center text-sm px-4 py-2 rounded-md border-2 border-neutral-300 text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Guide →
                        </a>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}