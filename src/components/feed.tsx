"use client"

import Image from "next/image"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import OverflowMenu from "./overflow-menu"
import { cn, formatDate } from "@/lib/utils"
import useSWRInfinite from "swr/infinite"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

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
  isLiked: boolean
  likes: number
  comments: string
  images: { id: string; url: string; altText?: string }[]
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
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={post.authorName}
                        alt={post.authorName}
                      />
                      <AvatarFallback>
                        {post.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm">
                          {post.authorName}
                        </h3>
                        <span className="text-gray-500 text-sm">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
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
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                  {post.content}
                </p>

                {post.images && post.images.length > 0 && (
                  <div
                    className={
                      post.images.length > 1
                        ? "mt-3 grid gap-2 sm:grid-cols-2"
                        : "mt-3 grid gap-2"
                    }>
                    {post.images.map((img, idx) => (
                      <div
                        key={img.id}
                        className="relative w-full overflow-hidden rounded-lg"
                        style={{
                          aspectRatio:
                            post.images.length > 1 ? "4 / 3" : "16 / 9",
                        }}>
                        <Image
                          src={img.url}
                          alt={img.altText || ""}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                          className="object-cover"
                          loading={idx === 0 ? "eager" : "lazy"}
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex items-center justify-between text-gray-500">
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center space-x-2 hover:text-red-500 ${
                        post.isLiked ? "text-red-500" : ""
                      }`}>
                      <Heart
                        className={`h-4 w-4 ${
                          post.isLiked ? "fill-current" : ""
                        }`}
                      />
                      <span className="text-sm">{post.likes}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 hover:text-blue-500">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{post.comments}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 hover:text-green-500">
                      <Share className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })}

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
