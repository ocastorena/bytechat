"use client"

import Image from "next/image"
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
    <article className="animate-fade-in-up px-1 py-4 border-b border-border/50 hover:bg-muted/30 transition-colors duration-150">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
            {post.authorUsername.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Author line */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-sm truncate">
                {post.authorUsername}
              </span>
              <span className="text-muted-foreground text-xs truncate">
                @{post.authorUsername}
              </span>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-muted-foreground text-xs shrink-0">
                {formatDate(post.createdAt)}
              </span>
            </div>

            {isOwnPost && onDelete && (
              <OverflowMenu
                postId={post.id}
                isOwnPost={isOwnPost}
                onDelete={onDelete}
              />
            )}
          </div>

          {/* Post body */}
          <p className="text-sm leading-relaxed mt-1">
            {post.content}
          </p>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div
              className={
                post.images.length > 1
                  ? "mt-3 grid gap-1 grid-cols-2"
                  : "mt-3"
              }>
              {post.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative w-full overflow-hidden rounded-lg border border-border/30"
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

          {/* Actions */}
          <div className="flex items-center gap-6 mt-3 -ml-1.5">
            <button className="flex items-center gap-1.5 p-1.5 rounded-md text-muted-foreground transition-colors hover:text-red-400 hover:bg-red-500/10">
              <Heart size={15} />
            </button>
            <button className="flex items-center gap-1.5 p-1.5 rounded-md text-muted-foreground transition-colors hover:text-accent hover:bg-accent/10">
              <MessageCircle size={15} />
            </button>
            <button className="flex items-center gap-1.5 p-1.5 rounded-md text-muted-foreground transition-colors hover:text-accent hover:bg-accent/10">
              <Share2 size={15} />
            </button>
            <button className="flex items-center gap-1.5 p-1.5 rounded-md text-muted-foreground transition-colors hover:text-accent hover:bg-accent/10">
              <Bookmark size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
