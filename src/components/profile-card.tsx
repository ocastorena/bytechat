"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getInitials, getAvatarUrl } from "@/lib/utils"
import { ROUTES } from "@/config/constants"

/** Compact profile card for the sidebar */
export function ProfileCard() {
  const { data: session } = useSession()
  const name = session?.user?.name || "user"

  return (
    <div className="bg-card rounded-xl overflow-hidden shrink-0">
      {/* Banner */}
      <div className="h-20 bg-gradient-to-br from-accent/40 via-[oklch(0.70_0.25_310/20%)] to-warm/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.72_0.19_195/25%),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.75_0.20_155/18%),transparent_60%)]" />
      </div>

      {/* Profile info */}
      <div className="px-4 pb-4 flex flex-col items-center text-center">
        <Avatar className="h-14 w-14 -mt-8 border-3 border-background shadow-md">
          <AvatarImage
            src={session?.user?.image || getAvatarUrl(name)}
            alt={name}
          />
          <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
            {session?.user?.name ? getInitials(session.user.name) : "U"}
          </AvatarFallback>
        </Avatar>

        <div className="mt-2">
          <h3 className="text-base font-bold truncate">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground font-mono">
            @{name}
          </p>
        </div>

        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Full-stack developer passionate about clean code and innovative solutions.
        </p>

        <div className="flex items-center gap-4 mt-3">
          <div className="text-sm">
            <span className="font-bold text-foreground">128</span>{" "}
            <span className="text-muted-foreground">Following</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-foreground">42</span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </div>
        </div>

        <Link
          href={ROUTES.PROFILE}
          className="block mt-3 text-sm text-accent hover:text-accent/80 font-medium transition-colors">
          My Profile
        </Link>
      </div>
    </div>
  )
}
