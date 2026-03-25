"use client"

import { TrendingUp } from "lucide-react"

/** Compact trending topics for the horizontal discovery strip */
const TRENDING_TOPICS = [
  { tag: "#BugBounty", posts: "18.3K" },
  { tag: "#CTF", posts: "14.1K" },
  { tag: "#RustLang", posts: "11.7K" },
  { tag: "#ZeroDay", posts: "9.4K" },
  { tag: "#HomeServer", posts: "7.8K" },
  { tag: "#OpenSource", posts: "22.6K" },
  { tag: "#NixOS", posts: "5.2K" },
]

/** Horizontal scrollable trending strip shown above the feed on smaller screens */
export function TrendingStrip() {
  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-2 mb-2 px-1">
        <TrendingUp size={14} className="text-accent shrink-0" />
        <h3 className="text-sm font-semibold text-foreground">Trending</h3>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TRENDING_TOPICS.map(({ tag, posts }) => (
          <button
            key={tag}
            className="shrink-0 rounded-full bg-card px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors duration-150 cursor-pointer">
            <span className="font-semibold">{tag}</span>
            <span className="text-muted-foreground ml-1.5">{posts}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
