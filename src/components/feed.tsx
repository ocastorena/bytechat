"use client"

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn, formatDate } from "@/lib/utils"
import useSWRInfinite from "swr/infinite"

const PAGE_SIZE = 10

type PostPage = {
  data: Post[]
  nextCursor?: string | null
}

type Post = {
  id: string
  authorName: string
  content: string
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Feed({ className }: React.ComponentProps<"section">) {
  const getKey = (pageIndex: number, prevPageData: PostPage | null) => {
    if (prevPageData && prevPageData.nextCursor === null) return null

    const cursorParam =
      pageIndex === 0 ? "" : `&cursor=${prevPageData?.nextCursor ?? ""}`

    return `/api/posts?limit=${PAGE_SIZE}${cursorParam}`
  }

  const { data, error, size, setSize, isLoading, isValidating } =
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

  if (posts.length == 0) {
    return <div className={cn("mb-3", className)}>No posts to show</div>
  }

  const hasMore = data && data[data.length - 1]?.nextCursor !== null

  return (
    <>
      {posts.map((post) => (
        <div key={post.id} className="flex flex-col gap-4 p-2">
          <Card>
            <CardHeader className="flex flex-row items-start gap-3">
              <Avatar className="h-10 w-10 bg-accent" />
              <div className="flex flex-col">
                <h3 className="font-medium">{post.authorName}</h3>
                <span className="text-sm text-muted-foreground">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <p>{post.content}</p>
            </CardContent>

            <CardFooter className="gap-4">
              <Button variant="ghost" size="sm">
                Like
              </Button>
              <Button variant="ghost" size="sm">
                Comment
              </Button>
            </CardFooter>
          </Card>
        </div>
      ))}

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
