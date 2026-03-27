"use client"

import { TrendingUp } from "lucide-react"
import { TRENDING_TOPICS } from "@/lib/mock-data"

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
