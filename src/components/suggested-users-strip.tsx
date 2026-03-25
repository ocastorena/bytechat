"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { cn, getAvatarUrl } from "@/lib/utils"
import { UserPlus } from "lucide-react"

/** Compact user cards for the horizontal discovery strip */
const SUGGESTED_USERS = [
  { name: "Sarah Chen", username: "@sarahbuilds", initials: "SC", verified: true },
  { name: "Alex Rivera", username: "@alexcodes", initials: "AR", verified: false },
  { name: "Maya Patel", username: "@mayatech", initials: "MP", verified: true },
  { name: "Jordan Kim", username: "@jordanux", initials: "JK", verified: false },
  { name: "Lena Xu", username: "@lenacrypto", initials: "LX", verified: true },
]

/** Compact follow button for strip cards */
function CompactFollowButton() {
  const [following, setFollowing] = useState(false)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        setFollowing(!following)
      }}
      className={cn(
        "rounded-full h-6 text-[11px] px-3 font-bold transition-all",
        following
          ? "border border-border text-foreground hover:border-destructive/50 hover:text-destructive"
          : "bg-accent text-accent-foreground hover:bg-accent/90"
      )}>
      {following ? "Following" : "Follow"}
    </button>
  )
}

/** Horizontal scrollable suggested users strip shown above the feed on smaller screens */
export function SuggestedUsersStrip() {
  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-2 mb-2 px-1">
        <UserPlus size={14} className="text-accent shrink-0" />
        <h3 className="text-sm font-semibold text-foreground">Who to follow</h3>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {SUGGESTED_USERS.map(({ name, username, initials, verified }) => (
          <div
            key={username}
            className="shrink-0 flex flex-col items-center gap-1.5 rounded-xl bg-card p-2.5 min-w-28 max-w-28 cursor-pointer hover:bg-muted/50 transition-colors duration-150">
            <Avatar className="h-9 w-9">
              <AvatarImage src={getAvatarUrl(username)} alt={name} />
              <AvatarFallback className="text-[10px] font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center min-w-0 w-full">
              <div className="flex items-center justify-center gap-0.5">
                <span className="text-xs font-semibold truncate">{name}</span>
                {verified && (
                  <svg
                    className="h-3 w-3 text-accent flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                {username}
              </p>
            </div>
            <CompactFollowButton />
          </div>
        ))}
      </div>
    </div>
  )
}
