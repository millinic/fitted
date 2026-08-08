"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  label?: string
  placeholder?: string
  suggestions?: readonly string[]
  maxTags?: number
}

export function TagInput({
  tags,
  onChange,
  label,
  placeholder = "Type and press Enter",
  suggestions = [],
  maxTags,
}: TagInputProps) {
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed) && (!maxTags || tags.length < maxTags)) {
      onChange([...tags, trimmed])
    }
    setInput("")
    setShowSuggestions(false)
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  )

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">{label}</label>
      )}
      <div className="flex flex-wrap gap-2 p-3 min-h-[44px] rounded-lg border border-neutral-200 bg-white focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 text-sm text-neutral-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-neutral-400 hover:text-neutral-600 ml-0.5"
            >
              ×
            </button>
          </span>
        ))}
        <div className="relative flex-1 min-w-[120px]">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTag(input)
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400 py-0.5"
          />
          {showSuggestions && input.length > 0 && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {filteredSuggestions.slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addTag(s)}
                  className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}