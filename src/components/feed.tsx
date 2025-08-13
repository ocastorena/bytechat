"use client"

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import OverflowMenu from "./overflow-menu"
import { cn, formatDate } from "@/lib/utils"
import useSWRInfinite from "swr/infinite"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { ThumbsUp, MessageSquare } from "lucide-react"

const PAGE_SIZE = 10

type PostPage = {
  data: Post[]
  nextCursor?: string | null
}

type Post = {
  id: string
  authorName: string
  content: string
  authorId: string
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface FeedProps extends React.ComponentProps<"section"> {
  userId?: string
}

export default function Feed({ className, userId }: FeedProps) {
  const { data: session } = useSession()
  const getKey = (pageIndex: number, prevPageData: PostPage | null) => {
    if (prevPageData && prevPageData.nextCursor === null) return null

    const cursorParam =
      pageIndex === 0 ? "" : `&cursor=${prevPageData?.nextCursor ?? ""}`

    const userParam = userId ? `&userId=${encodeURIComponent(userId)}` : ""

    return `/api/posts?limit=${PAGE_SIZE}${cursorParam}${userParam}`
  }

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite<PostPage>(getKey, fetcher, {
      refreshInterval: 10000,
      refreshWhenHidden: false,
    })

  if (isLoading && !data) {
    return <div className={cn("mb-3", className)}>Loading...</div>
  }

  if (error) {
    return <div className={cn("mb-3", className)}>Error loading posts</div>
  }

  const posts: Post[] = data ? data.flatMap((p) => p.data) : []

  if (posts.length === 0) {
    return <div className={cn("mb-3", className)}>No posts to show</div>
  }

  const hasMore = data && data[data.length - 1]?.nextCursor !== null

  return (
    <>
      {posts.map((post) => {
        const isOwnPost = session?.user?.id === post.authorId // compare IDs

        return (
          <div key={post.id} className="flex flex-col gap-4 p-2">
            <Card>
              <CardHeader className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 bg-accent" />
                  <div className="flex flex-col">
                    <h3 className="font-medium">{post.authorName}</h3>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>

                {isOwnPost && (
                  <OverflowMenu
                    postId={post.id}
                    isOwnPost={isOwnPost}
                    onDelete={async (postId) => {
                      // 1) Snapshot current pages
                      const prev = data

                      // 2) Optimistically remove the post from all pages
                      const optimistic = prev?.map((page) => ({
                        ...page,
                        data: page.data.filter((p) => p.id !== postId),
                      }))

                      // apply optimistic cache without revalidation
                      mutate(optimistic, { revalidate: false })

                      try {
                        const res = await fetch(`/api/posts/${postId}`, {
                          method: "DELETE",
                        })

                        if (!res.ok) {
                          let message = "Failed to delete post"
                          try {
                            const body = await res.json()
                            if (body?.error) message = body.error
                          } catch {}
                          throw new Error(message)
                        }

                        // 3) Confirm success & revalidate from server
                        toast.success("Post deleted")
                        await mutate()
                      } catch (err) {
                        // 4) Rollback and notify
                        mutate(prev, { revalidate: false })
                        toast.error(
                          err instanceof Error
                            ? err.message
                            : "Failed to delete post"
                        )
                      }
                    }}
                  />
                )}
              </CardHeader>

              <CardContent>
                <p>{post.content}</p>
              </CardContent>

              <CardFooter className="gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comment
                </Button>
              </CardFooter>
            </Card>
          </div>
        )
      })}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            disabled={isValidating}
            onClick={() => {
              setSize(size + 1)
            }}
            className="mt-4">
            {isValidating ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </>
  )
}
