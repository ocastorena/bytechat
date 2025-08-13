import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma" // your singleton
import CreatePostForm from "@/components/create-post-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Feed from "@/components/feed"
import { Avatar } from "@/components/ui/avatar"

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
    // query database
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
    <main className="grid grid-cols-12 gap-6 px-6">
      <div className="col-start-4 col-end-6 sticky top-26 h-[calc(100dvh-8rem)]">
        <Card className="px-6">
          <CardHeader className="flex flex-row items-center">
            <Avatar className="h-10 w-10 bg-accent" />
            <h2>{session?.user?.name}</h2>
          </CardHeader>
          <CardContent>
            {userProfile ? (
              <>
                <p>Email: {userProfile.email}</p>
                <p>
                  Joined: {new Date(userProfile.createdAt).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="col-start-6 col-end-10 mt-6">
        <CreatePostForm />
        <Feed userId={userId} />
      </div>
    </main>
  )
}
