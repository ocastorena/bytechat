"use client"

import { PostCard } from "./post-card"
import { cn } from "@/lib/utils"
import useSWRInfinite from "swr/infinite"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useCallback } from "react"
import type { Post, PostPage } from "@/types"
import { apiClient, request } from "@/lib/api-client"
import { PAGINATION } from "@/config/constants"

/** Skeleton for a single post — matches borderless layout */
function PostSkeleton() {
  return (
    <div className="px-1 py-4 border-b border-border">
      <div className="flex gap-3">
        <div className="h-9 w-9 rounded-full bg-muted animate-pulse shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="flex gap-2">
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/** Loading skeleton for the feed */
function FeedSkeleton() {
  return (
    <div>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  )
}

const { PAGE_SIZE, REFRESH_INTERVAL } = PAGINATION

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
    useSWRInfinite<PostPage>(getKey, request, {
      refreshInterval: REFRESH_INTERVAL,
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
      <div className={cn("py-12 text-center", className)}>
        <p className="text-muted-foreground text-sm">
          Something went wrong loading the feed.
        </p>
        <button
          onClick={() => mutate()}
          className="mt-2 text-sm text-accent hover:underline">
          Try again
        </button>
      </div>
    )
  }

  const posts: Post[] = data ? data.flatMap((p) => p.data) : []

  if (posts.length === 0) {
    return (
      <div className={cn("py-12 text-center", className)}>
        <p className="text-foreground font-medium text-sm">No posts yet</p>
        <p className="text-muted-foreground text-xs mt-1">
          Be the first to share something.
        </p>
      </div>
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
      await apiClient.posts.delete(postId)
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
    <div>
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
        <div className="flex justify-center py-6">
          <span className="text-xs text-muted-foreground">Loading...</span>
        </div>
      )}
    </div>
  )
}
