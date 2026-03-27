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
import { isDemoMode } from "@/lib/demo"
import { MessageSquare } from "lucide-react"

/** Skeleton for a single post — matches card style */
function PostSkeleton({ delay = 0 }: { delay?: number }) {
  const style = delay ? { animationDelay: `${delay}ms` } : undefined
  return (
    <div className="p-4 rounded-xl bg-card">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse shrink-0" style={style} />
        <div className="flex-1 space-y-2.5">
          <div className="flex gap-2">
            <div className="h-3 w-20 bg-muted rounded animate-pulse" style={style} />
            <div className="h-3 w-16 bg-muted rounded animate-pulse" style={style} />
          </div>
          <div className="h-3 w-full bg-muted rounded animate-pulse" style={style} />
          <div className="h-3 w-3/4 bg-muted rounded animate-pulse" style={style} />
        </div>
      </div>
    </div>
  )
}

/** Loading skeleton for the feed — staggered wave effect */
function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <PostSkeleton delay={0} />
      <PostSkeleton delay={150} />
      <PostSkeleton delay={300} />
    </div>
  )
}

/** Pulsing dots spinner for infinite scroll loading */
function LoadingDots() {
  return (
    <div className="flex justify-center py-6 gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-pulse" />
      <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-pulse [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-pulse [animation-delay:300ms]" />
    </div>
  )
}

const { PAGE_SIZE, REFRESH_INTERVAL } = PAGINATION

interface FeedProps extends React.ComponentProps<"section"> {
  /** Filter posts by author */
  userId?: string
  /** Search posts by content */
  query?: string
}

/** Paginated post feed with infinite scroll */
export default function Feed({ className, userId, query }: FeedProps) {
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
    if (query) {
      params.set("query", query)
    }

    return `/api/posts?${params.toString()}`
  }

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite<PostPage>(getKey, request, {
      refreshInterval: isDemoMode ? 0 : REFRESH_INTERVAL,
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
      <div className={cn("py-16 text-center", className)}>
        <p className="text-muted-foreground text-sm">
          Something went wrong loading the feed.
        </p>
        <button
          onClick={() => mutate()}
          className="mt-3 text-sm text-accent hover:text-accent/80 transition-colors">
          Try again
        </button>
      </div>
    )
  }

  const posts: Post[] = data ? data.flatMap((p) => p.data) : []

  if (posts.length === 0) {
    return (
      <div className={cn("py-16 text-center", className)}>
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-muted mb-3">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </div>
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
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isOwnPost={session?.user?.id === post.authorId}
          onDelete={handleDelete}
        />
      ))}

      <div ref={sentinelRef} className="h-1" />

      {isValidating && <LoadingDots />}
    </div>
  )
}
