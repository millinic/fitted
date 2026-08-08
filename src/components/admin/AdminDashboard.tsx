"use client"

import { useState, useEffect } from "react"
import { getPendingGuides, approveGuide, rejectGuide } from "@/actions/guide"
import { getAdminStats } from "@/actions/admin"
import { Button } from "@/components/ui/Button"
import type { StyleGuide, StyleGuideContent } from "@/types"

export function AdminDashboard() {
  const [guides, setGuides] = useState<StyleGuide[]>([])
  const [stats, setStats] = useState<{
    totalUsers: number
    totalAssessments: number
    totalPayments: number
    pendingGuides: number
    deliveredGuides: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const loadData = async () => {
    try {
      const [guidesResult, statsResult] = await Promise.all([
        getPendingGuides(),
        getAdminStats(),
      ])

      if (guidesResult.success && guidesResult.data) {
        setGuides(guidesResult.data)
      }
      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data)
      }
    } catch (err) {
      console.error("Failed to load admin data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApprove = async (guideId: string) => {
    setActionLoading(guideId)
    try {
      const result = await approveGuide(guideId, notes[guideId])
      if (result.success) {
        setGuides((prev) => prev.filter((g) => g.id !== guideId))
      }
    } catch (err) {
      console.error("Failed to approve guide:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (guideId: string) => {
    if (!notes[guideId]?.trim()) {
      alert("Please add notes explaining why this guide is being rejected.")
      return
    }
    setActionLoading(guideId)
    try {
      const result = await rejectGuide(guideId, notes[guideId])
      if (result.success) {
        setGuides((prev) => prev.filter((g) => g.id !== guideId))
      }
    } catch (err) {
      console.error("Failed to reject guide:", err)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-neutral-200 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900 mb-8">
        Admin Dashboard
      </h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
          {[
            { label: "Users", value: stats.totalUsers },
            { label: "Assessments", value: stats.totalAssessments },
            { label: "Payments", value: stats.totalPayments },
            { label: "Pending Review", value: stats.pendingGuides },
            { label: "Delivered", value: stats.deliveredGuides },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-neutral-200 p-4 text-center"
            >
              <p className="font-serif text-2xl font-semibold text-neutral-900">
                {stat.value}
              </p>
              <p className="text-xs text-neutral-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pending Guides */}
      <div className="mb-8">
        <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-4">
          Guides Pending Review ({guides.length})
        </h2>

        {guides.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
            <p className="text-neutral-500">No guides pending review. All caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {guides.map((guide) => {
              const content = guide.guideContent as StyleGuideContent | null
              const isExpanded = expandedGuide === guide.id
              const isLoading = actionLoading === guide.id

              return (
                <div
                  key={guide.id}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden"
                >
                  {/* Guide Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-neutral-50 transition-colors"
                    onClick={() =>
                      setExpandedGuide(isExpanded ? null : guide.id)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">
                          Guide #{guide.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          User: {guide.userId.slice(0, 8)}... · Created:{" "}
                          {new Date(guide.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400">
                          {content?.sections.length || 0} sections ·{" "}
                          {content?.sections.reduce(
                            (acc, s) => acc + s.items.length,
                            0
                          ) || 0}{" "}
                          items
                        </span>
                        <svg
                          className={`w-5 h-5 text-neutral-400 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && content && (
                    <div className="border-t border-neutral-200 p-6">
                      {/* Sections overview */}
                      <div className="space-y-6 mb-8">
                        {content.sections.map((section, idx) => (
                          <div key={idx}>
                            <h4 className="text-sm font-semibold text-neutral-800 mb-3">
                              {section.category}
                            </h4>
                            <div className="space-y-2">
                              {section.items.map((item, itemIdx) => (
                                <div
                                  key={itemIdx}
                                  className="flex items-start justify-between gap-4 p-3 rounded-lg bg-neutral-50 text-sm"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-neutral-800">
                                      {item.brand} — {item.name}
                                    </p>
                                    <p className="text-neutral-500 text-xs mt-0.5">
                                      {item.description}
                                    </p>
                                    <p className="text-brand-700 text-xs italic mt-1">
                                      &ldquo;{item.reasoning}&rdquo;
                                    </p>
                                  </div>
                                  <span className="text-xs text-neutral-400 whitespace-nowrap">
                                    {item.priceRange}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Lookbooks */}
                      {content.lookbooks.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-neutral-800 mb-3">
                            Lookbooks
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {content.lookbooks.map((lb, idx) => (
                              <div key={idx} className="p-3 rounded-lg bg-neutral-50">
                                <p className="font-medium text-sm text-neutral-800">
                                  {lb.name}
                                </p>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                  {lb.description}
                                </p>
                                <p className="text-xs text-neutral-400 mt-1">
                                  Items: {lb.items.join(", ")}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* General Tips */}
                      {content.generalTips.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-neutral-800 mb-3">
                            General Tips
                          </h4>
                          <ul className="space-y-1">
                            {content.generalTips.map((tip, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-neutral-600 flex items-start gap-2"
                              >
                                <span className="text-neutral-400">{idx + 1}.</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Notes & Actions */}
                      <div className="border-t border-neutral-200 pt-6 mt-6">
                        <label
                          htmlFor={`notes-${guide.id}`}
                          className="block text-sm font-medium text-neutral-700 mb-1.5"
                        >
                          Reviewer notes{" "}
                          <span className="text-neutral-400 font-normal">
                            (required for rejection)
                          </span>
                        </label>
                        <textarea
                          id={`notes-${guide.id}`}
                          rows={3}
                          value={notes[guide.id] || ""}
                          onChange={(e) =>
                            setNotes((prev) => ({
                              ...prev,
                              [guide.id]: e.target.value,
                            }))
                          }
                          placeholder="Any notes about this guide..."
                          className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none mb-4"
                        />

                        <div className="flex gap-3">
                          <Button
                            variant="primary"
                            onClick={() => handleApprove(guide.id)}
                            loading={isLoading}
                            disabled={isLoading}
                          >
                            Approve & Deliver
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleReject(guide.id)}
                            loading={isLoading}
                            disabled={isLoading}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}