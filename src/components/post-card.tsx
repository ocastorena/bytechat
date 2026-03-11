"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import OverflowMenu from "./overflow-menu"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/types"

interface PostCardProps {
  post: Post
  isOwnPost: boolean
  onDelete?: (postId: string) => void
}

export function PostCard({ post, isOwnPost, onDelete }: PostCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {post.authorUsername.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm">
                  {post.authorUsername}
                </h3>
                <span className="text-muted-foreground text-xs">
                  @{post.authorUsername}
                </span>
                <span className="text-muted-foreground text-xs">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {isOwnPost && onDelete && (
            <OverflowMenu
              postId={post.id}
              isOwnPost={isOwnPost}
              onDelete={onDelete}
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-foreground leading-relaxed">
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

        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <button disabled className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50">
            <Heart size={18} />
          </button>
          <button disabled className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-50">
            <MessageCircle size={18} />
          </button>
          <button disabled className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-50">
            <Share2 size={18} />
          </button>
          <button disabled className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-50">
            <Bookmark size={18} />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
