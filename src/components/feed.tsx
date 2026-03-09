"use client"

import { Button } from "@/components/ui/button"
import { PostCard } from "./post-card"
import { cn } from "@/lib/utils"
import useSWRInfinite from "swr/infinite"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import type { Post, PostPage } from "@/types"

const PAGE_SIZE = 10

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

  const handleDelete = async (postId: string) => {
    const prev = data

    const optimistic = prev?.map((page) => ({
      ...page,
      data: page.data.filter((p) => p.id !== postId),
    }))

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

      toast.success("Post deleted")
      await mutate()
    } catch (err) {
      mutate(prev, { revalidate: false })
      toast.error(
        err instanceof Error ? err.message : "Failed to delete post"
      )
    }
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isOwnPost={session?.user?.id === post.authorId}
          onDelete={handleDelete}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center mb-6">
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
