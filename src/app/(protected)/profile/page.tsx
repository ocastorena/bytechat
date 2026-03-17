import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { CreatePostForm } from "@/components/create-post-form"
import Feed from "@/components/feed"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
        {/* Profile header */}
        <div className="pb-6 mb-2 border-b border-border">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 shrink-0 border-2 border-border">
              <AvatarImage
                src={session?.user?.image || undefined}
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
                {session?.user?.name ? getInitials(session.user.name) : "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold">
                {session?.user?.name || "Anonymous User"}
              </h2>
              <p className="text-sm text-muted-foreground">@{username}</p>

              {userProfile && (
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    {userProfile.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3" />
                    Joined {formatDate(userProfile.createdAt.toDateString())}
                  </span>
                </div>
              )}

              {userProfile && (
                <div className="flex items-center gap-4 mt-3">
                  <div className="text-sm">
                    <span className="font-bold text-foreground">
                      {userProfile.posts.length}
                    </span>{" "}
                    <span className="text-muted-foreground">posts</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-foreground">42</span>{" "}
                    <span className="text-muted-foreground">followers</span>
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Full-stack developer passionate about clean code and innovative
                solutions. Always learning, always building.
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {["React", "TypeScript", "Next.js", "Node.js"].map(
                  (skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-[11px] border-border/80">
                      {skill}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User posts */}
        <CreatePostForm />
        <Feed userId={userId} />
      </div>
    </main>
  )
}
