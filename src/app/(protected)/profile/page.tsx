import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { CreatePostForm } from "@/components/create-post-form"
import Feed from "@/components/feed"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Mail } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"

export default async function Page() {
  const session = await auth()
  const userId = session?.user?.id
  let userProfile: {
    id: string
    email: string
    username: string | null
    createdAt: Date
    posts: { id: string; content: string; createdAt: Date }[]
  } | null = null

  try {
    userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        posts: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("[USERS_GET]", error)
  }

  const username =
    userProfile?.username ||
    session?.user?.email?.split("@")[0] ||
    "user"

  return (
    <main className="flex justify-center px-4 mt-4 max-w-6xl mx-auto w-full">
      <div className="w-full max-w-xl">
        {/* Profile banner */}
        <div className="relative h-36 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-accent/20 via-accent/8 to-warm/12 border border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.65_0.16_250/10%),transparent_70%)]" />
        </div>

        {/* Profile header */}
        <div className="pb-4 mb-2 border-b border-border -mt-12 px-1">
          <div className="flex items-end justify-between">
            <Avatar className="h-20 w-20 shrink-0 border-4 border-background shadow-lg">
              <AvatarImage
                src={session?.user?.image || undefined}
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
                {session?.user?.name ? getInitials(session.user.name) : "U"}
              </AvatarFallback>
            </Avatar>

            <button className="rounded-full px-4 py-1.5 border border-border text-sm font-semibold hover:bg-muted/50 transition-colors mb-1">
              Edit Profile
            </button>
          </div>

          <div className="mt-3">
            <h2 className="text-xl font-bold">
              {session?.user?.name || "Anonymous User"}
            </h2>
            <p className="text-sm text-muted-foreground font-mono">@{username}</p>

            {userProfile && (
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {userProfile.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Joined {formatDate(userProfile.createdAt.toDateString())}
                </span>
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Full-stack developer passionate about clean code and innovative
              solutions. Always learning, always building.
            </p>

            {userProfile && (
              <div className="flex items-center gap-5 mt-3">
                <div className="text-sm">
                  <span className="font-bold text-foreground">128</span>{" "}
                  <span className="text-muted-foreground">Following</span>
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">42</span>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">
                    {userProfile.posts.length}
                  </span>{" "}
                  <span className="text-muted-foreground">Posts</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 mt-3">
              {["React", "TypeScript", "Next.js", "Node.js"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-accent/10 text-accent rounded-full px-3 py-1 font-medium">
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-border mb-2">
          {["Posts", "Replies", "Likes"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                tab === "Posts"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}>
              {tab}
              {tab === "Posts" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-accent rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* User posts */}
        <CreatePostForm />
        <Feed userId={userId} />
      </div>
    </main>
  )
}
