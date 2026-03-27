"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

/** Follow button with Twitter-style inverted colors */
export function FollowButton({ size = "default", onClick }: { size?: "sm" | "default"; onClick?: (e: React.MouseEvent) => void }) {
  const [following, setFollowing] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e)
    setFollowing(!following)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full shrink-0 font-bold transition-all",
        size === "sm"
          ? "h-6 text-[11px] px-3"
          : "h-7 text-xs px-4 ml-2",
        following
          ? "border border-border text-foreground hover:border-destructive/50 hover:text-destructive hover:bg-destructive/10"
          : "bg-accent text-accent-foreground hover:bg-accent/90"
      )}>
      {following ? "Following" : "Follow"}
    </button>
  )
}
