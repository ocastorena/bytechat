"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { cn } from "@/lib/utils"

const SUGGESTED_USERS = [
  {
    name: "Sarah Chen",
    username: "@sarahbuilds",
    initials: "SC",
    bio: "Senior Frontend Engineer at Vercel",
    verified: true,
  },
  {
    name: "Alex Rivera",
    username: "@alexcodes",
    initials: "AR",
    bio: "Full-stack dev & tech blogger",
    verified: false,
  },
  {
    name: "Maya Patel",
    username: "@mayatech",
    initials: "MP",
    bio: "AI/ML Engineer, Python enthusiast",
    verified: true,
  },
  {
    name: "Jordan Kim",
    username: "@jordanux",
    initials: "JK",
    bio: "UX Designer turning code into art",
    verified: false,
  },
]

/** Follow button with Twitter-style inverted colors */
function FollowButton() {
  const [following, setFollowing] = useState(false)

  return (
    <button
      onClick={() => setFollowing(!following)}
      className={cn(
        "rounded-full h-7 text-xs px-4 shrink-0 ml-2 font-bold transition-all",
        following
          ? "border border-border text-foreground hover:border-destructive/50 hover:text-destructive hover:bg-destructive/10"
          : "bg-foreground text-background hover:bg-foreground/90"
      )}>
      {following ? "Following" : "Follow"}
    </button>
  )
}

/** Sidebar showing suggested users to follow */
export function SuggestedUsersSidebar() {
  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-lg font-bold text-foreground mb-3">
        Who to follow
      </h3>
      <ul className="space-y-0.5">
        {SUGGESTED_USERS.map(
          ({ name, username, initials, bio, verified }) => (
            <li
              key={username}
              className="flex items-start gap-2.5 rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
              <Avatar className="h-9 w-9 shrink-0 mt-0.5">
                <AvatarFallback className="text-[10px] font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-sm font-semibold truncate">
                      {name}
                    </span>
                    {verified && (
                      <svg
                        className="h-3.5 w-3.5 text-accent flex-shrink-0"
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
