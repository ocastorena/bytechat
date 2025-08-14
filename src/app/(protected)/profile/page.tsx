import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { CreatePostForm } from "@/components/create-post-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Feed from "@/components/feed"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, MessageSquare, Users } from "lucide-react"
import { Separator } from "@/components/ui/separator"
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
      where: { id: userId ?? session?.user?.id },
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

  return (
    <main className="grid grid-cols-12 gap-6 px-6 mt-6">
      <div className="col-start-4 col-end-6 sticky top-26 h-[calc(100dvh-8rem)]">
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                  <AvatarImage
                    src={session?.user?.image || undefined}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {session?.user?.name ? getInitials(session.user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-2 border-background rounded-full"></div>
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-foreground">
                  {session?.user?.name || "Anonymous User"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  @
                  {userProfile?.username ||
                    session?.user?.email?.split("@")[0] ||
                    "user"}
                </p>
                <Badge variant="secondary" className="text-xs">
                  Active Developer
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Separator />

            {userProfile ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{userProfile.email}</span>
                </div>

                <div className="flex items-center space-x-3 text-muted-foreground">
                  <CalendarDays className="h-4 w-4 flex-shrink-0" />
                  <span>
                    Joined {formatDate(userProfile.createdAt.toDateString())}
                  </span>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-bold">
                        {userProfile.posts.length}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Posts</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span className="font-bold">42</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Bio</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    💻 Full-stack developer passionate about clean code and
                    innovative solutions. Always learning, always building.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {["React", "TypeScript", "Next.js", "Node.js"].map(
                    (skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse space-y-2 text-center">
                  <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading profile...
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="col-start-6 col-end-10">
        <CreatePostForm />
        <Feed userId={userId} />
      </div>
    </main>
  )
}
