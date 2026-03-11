"use client"

import { PostCard } from "./post-card"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import useSWRInfinite from "swr/infinite"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useCallback } from "react"
import type { Post, PostPage } from "@/types"

function PostSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-28 bg-muted rounded" />
          <div className="h-2 w-20 bg-muted rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-3/4 bg-muted rounded" />
      </div>
    </Card>
  )
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  )
}

const PAGE_SIZE = 10

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface FeedProps extends React.ComponentProps<"section"> {
  userId?: string
}

export default function Feed({ className, userId }: FeedProps) {
  const { data: session } = useSession()
  const sentinelRef = useRef<HTMLDivElement>(null)

  const getKey = (pageIndex: number, prevPageData: PostPage | null) => {
    if (prevPageData && prevPageData.nextCursor === null) return null

    const params = new URLSearchParams()
    params.set("limit", String(PAGE_SIZE))
    if (pageIndex > 0 && prevPageData?.nextCursor) {
      params.set("cursor", prevPageData.nextCursor)
    }
    if (userId) {
      params.set("userId", userId)
    }

    return `/api/posts?${params.toString()}`
  }

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite<PostPage>(getKey, fetcher, {
      refreshInterval: 10000,
      refreshWhenHidden: false,
    })

  const hasMore = data && data[data.length - 1]?.nextCursor !== null

  const loadMore = useCallback(() => {
    if (!isValidating && hasMore) {
      setSize(size + 1)
    }
  }, [isValidating, hasMore, setSize, size])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  if (isLoading && !data) {
    return <FeedSkeleton />
  }

  if (error) {
    return (
      <Card className={cn("p-8 text-center", className)}>
        <p className="text-muted-foreground text-sm">Something went wrong loading the feed.</p>
        <button
          onClick={() => mutate()}
          className="mt-2 text-sm text-accent hover:underline">
          Try again
        </button>
      </Card>
    )
  }

  const posts: Post[] = data ? data.flatMap((p) => p.data) : []

  if (posts.length === 0) {
    return (
      <Card className={cn("p-8 text-center", className)}>
        <p className="text-foreground font-medium">No posts yet</p>
        <p className="text-muted-foreground text-sm mt-1">
          Be the first to share something or follow others to see their posts.
        </p>
      </Card>
    )
  }

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
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isOwnPost={session?.user?.id === post.authorId}
          onDelete={handleDelete}
        />
      ))}

      <div ref={sentinelRef} className="h-1" />

      {isValidating && (
        <div className="flex justify-center py-4">
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      )}
    </div>
  )
}
