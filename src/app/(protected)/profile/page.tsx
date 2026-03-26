import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Mail, Pencil, Heart, Repeat2, MessageCircle } from "lucide-react"
import { formatDate, getInitials, getAvatarUrl } from "@/lib/utils"

/** Skill pill colors cycling through the neon palette */
const SKILL_COLORS = [
  { bg: "bg-[oklch(0.72_0.19_195/10%)]", text: "text-[oklch(0.72_0.19_195)]" },   // cyan
  { bg: "bg-[oklch(0.70_0.25_10/10%)]", text: "text-[oklch(0.70_0.25_10)]" },      // rose
  { bg: "bg-[oklch(0.72_0.19_155/10%)]", text: "text-[oklch(0.72_0.19_155)]" },     // green
  { bg: "bg-[oklch(0.70_0.20_310/10%)]", text: "text-[oklch(0.70_0.20_310)]" },     // purple
  { bg: "bg-[oklch(0.80_0.18_65/10%)]", text: "text-[oklch(0.80_0.18_65)]" },       // warm
]


export default async function Page() {
  const session = await auth()
  const userId = session?.user?.id
  let userProfile: {
    id: string
    email: string
    username: string | null
    createdAt: Date
    _count: { posts: number }
  } | null = null

  try {
    userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        _count: { select: { posts: true } },
      },
    })
  } catch (error) {
    console.error("[USERS_GET]", error)
  }

  const username =
    userProfile?.username ||
    session?.user?.email?.split("@")[0] ||
    "user"

  const displayName = session?.user?.name || "Anonymous User"

  return (
    <main className="flex justify-center px-4 pt-4 max-w-6xl mx-auto w-full">
      <div className="w-full max-w-xl flex flex-col gap-3">
        {/* Profile card */}
        <div className="rounded-xl bg-card overflow-hidden">
          {/* Banner */}
          <div className="relative h-28 sm:h-36 bg-gradient-to-br from-accent/30 via-[oklch(0.70_0.25_310/15%)] to-warm/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.72_0.19_195/20%),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.75_0.20_155/12%),transparent_60%)]" />
          </div>

          {/* Profile info */}
          <div className="px-4 sm:px-5 pb-5">
            {/* Avatar + Edit button row */}
            <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-3">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 border-4 border-card shadow-lg">
                <AvatarImage
                  src={session?.user?.image || getAvatarUrl(username)}
                  alt={displayName}
                />
                <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>

              <button className="flex items-center gap-1.5 rounded-full px-4 py-1.5 bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors shadow-[0_0_10px_-2px_oklch(0.72_0.19_195/30%)]">
                <Pencil size={14} />
                Edit Profile
              </button>
            </div>

            {/* Name + handle */}
            <h2 className="text-xl font-bold">{displayName}</h2>
            <p className="text-sm text-muted-foreground font-mono">@{username}</p>

            {/* Bio */}
            <p className="text-sm text-foreground/90 mt-3 leading-relaxed">
              Full-stack developer passionate about clean code and innovative
              solutions. Always learning, always building.
            </p>

            {/* Meta info */}
            {userProfile && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[oklch(0.72_0.19_195)]" />
                  {userProfile.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[oklch(0.80_0.18_65)]" />
                  Joined {formatDate(userProfile.createdAt.toDateString())}
                </span>
              </div>
            )}

            {/* Skills — cycling neon colors */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {["Full-Stack Dev", "Open Source", "DevOps", "Cloud Architecture", "System Design"].map(
                (skill, i) => {
                  const color = SKILL_COLORS[i % SKILL_COLORS.length]
                  return (
                    <span
                      key={skill}
                      className={`text-xs ${color.bg} ${color.text} rounded-full px-3 py-1 font-medium`}>
                      {skill}
                    </span>
                  )
                }
              )}
            </div>
          </div>
        </div>

        {/* Stats card — with neon colored icons */}
        <div className="rounded-xl bg-card p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[oklch(0.70_0.25_10/10%)] mb-1">
                <Heart size={14} className="text-[oklch(0.70_0.25_10)]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">128</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Following</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[oklch(0.72_0.19_250/10%)] mb-1">
                <Repeat2 size={14} className="text-[oklch(0.72_0.19_250)]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">42</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[oklch(0.72_0.19_155/10%)] mb-1">
                <MessageCircle size={14} className="text-[oklch(0.72_0.19_155)]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {userProfile?._count.posts ?? 0}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Posts</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
