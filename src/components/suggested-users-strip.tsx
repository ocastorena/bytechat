"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils"
import { UserPlus } from "lucide-react"
import { SUGGESTED_USERS } from "@/lib/mock-data"
import { FollowButton } from "@/components/follow-button"
import { VerifiedBadge } from "@/components/verified-badge"

/** Horizontal scrollable suggested users strip shown above the feed on smaller screens */
export function SuggestedUsersStrip() {
  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-2 mb-2 px-1">
        <UserPlus size={14} className="text-accent shrink-0" />
        <h3 className="text-sm font-semibold text-foreground">Who to follow</h3>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {SUGGESTED_USERS.slice(0, 5).map(({ name, username, initials, verified }) => (
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
                {verified && <VerifiedBadge className="h-3 w-3" />}
              </div>
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                {username}
              </p>
            </div>
            <FollowButton size="sm" onClick={(e) => e.stopPropagation()} />
          </div>
        ))}
      </div>
    </div>
  )
}
