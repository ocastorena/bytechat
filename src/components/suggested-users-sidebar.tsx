"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils"
import { SUGGESTED_USERS } from "@/lib/mock-data"
import { FollowButton } from "@/components/follow-button"
import { VerifiedBadge } from "@/components/verified-badge"

/** Sidebar showing suggested users to follow */
export function SuggestedUsersSidebar() {
  return (
    <div className="bg-card rounded-xl p-4">
      <h3 className="text-lg font-bold text-foreground mb-3">
        Who to follow
      </h3>
      <ul className="space-y-0.5">
        {SUGGESTED_USERS.map(
          ({ name, username, initials, bio, verified }) => (
            <li
              key={username}
              className="flex items-start gap-2.5 rounded-xl px-2 py-2 hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
              <Avatar className="h-9 w-9 shrink-0 mt-0.5">
                <AvatarImage
                  src={getAvatarUrl(username)}
                  alt={name}
                />
                <AvatarFallback className="text-[10px] font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-base font-semibold truncate">
                      {name}
                    </span>
                    {verified && <VerifiedBadge className="h-3.5 w-3.5" />}
                  </div>
                  <FollowButton />
                </div>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {username}
                </p>
                <p className="text-xs text-muted-foreground/80 truncate mt-0.5">
                  {bio}
                </p>
              </div>
            </li>
          )
        )}
      </ul>
      <button className="mt-3 px-2 text-sm text-accent hover:text-accent/80 font-medium transition-colors">
        Show more
      </button>
    </div>
  )
}
