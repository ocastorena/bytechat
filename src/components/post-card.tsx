"use client"

import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Repeat2, Bookmark, ThumbsUp } from "lucide-react"
import OverflowMenu from "./overflow-menu"
import { cn, formatDate, formatDateFull } from "@/lib/utils"
import type { Post } from "@/types"

/** Props for the PostCard component */
interface PostCardProps {
  post: Post
  isOwnPost: boolean
  onDelete?: (postId: string) => void
}

/** Generates deterministic engagement numbers from post content */
function getEngagement(content: string) {
  const seed = content.length + content.charCodeAt(0)
  const reactions = ((seed * 137) % 900) + 100
  const comments = ((seed * 53) % 80) + 5
  return {
    reactions: reactions > 500 ? `${(reactions / 10).toFixed(1)}k` : String(reactions),
    comments,
  }
}

/** Renders a single post in the feed */
export function PostCard({ post, isOwnPost, onDelete }: PostCardProps) {
  const engagement = getEngagement(post.content)

  return (
    <article className="p-4 rounded-xl border border-border bg-card hover:bg-card/90 transition-colors duration-150">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
            {post.authorUsername.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Author line */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="font-semibold text-[15px] text-foreground truncate">
                {post.authorUsername}
              </span>
              <span className="text-muted-foreground/60 text-sm font-mono truncate">
                @{post.authorUsername}
              </span>
              <span className="text-muted-foreground/40 text-sm">·</span>
              <span
                className="text-muted-foreground/60 text-sm shrink-0 cursor-default"
                title={formatDateFull(post.createdAt)}>
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
          <p className="text-[15px] leading-relaxed mt-1">{post.content}</p>

          {/* Images — adaptive grid: 1=full, 2=side-by-side, 3=1+2, 4=2x2 */}
          {post.images && post.images.length > 0 && (
            <div
              className={cn(
                "mt-3 grid gap-0.5 overflow-hidden rounded-2xl border border-border",
                post.images.length === 1 && "grid-cols-1",
                post.images.length === 2 && "grid-cols-2",
                post.images.length === 3 && "grid-cols-2 grid-rows-2",
                post.images.length >= 4 && "grid-cols-2 grid-rows-2"
              )}>
              {post.images.slice(0, 4).map((img, idx) => (
                <div
                  key={img.id}
                  className={cn(
                    "relative w-full overflow-hidden",
                    post.images.length === 3 && idx === 0 && "row-span-2"
                  )}
                  style={{ aspectRatio: post.images.length === 1 ? "16 / 9" : "3 / 2" }}>
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

          {/* Engagement row — reactions + comments */}
          <div className="flex items-center justify-between text-xs text-muted-foreground py-2.5 border-b border-border/40 mt-3">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <span className="h-4 w-4 rounded-full bg-[oklch(0.70_0.25_10)] border-2 border-card flex items-center justify-center">
                  <Heart size={8} className="text-white" />
                </span>
                <span className="h-4 w-4 rounded-full bg-accent border-2 border-card flex items-center justify-center">
                  <ThumbsUp size={8} className="text-white" />
                </span>
                <span className="h-4 w-4 rounded-full bg-warm border-2 border-card flex items-center justify-center">
                  <Heart size={8} className="text-white" />
                </span>
              </div>
              <span>{engagement.reactions}</span>
            </div>
            <span>{engagement.comments} Comments</span>
          </div>

          {/* Actions — Like, Repost, Comment, Bookmark */}
          <div className="flex items-center gap-2 mt-3">
            <button className="group flex items-center gap-1.5 border border-border/60 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground/60 transition-all hover:text-[oklch(0.70_0.25_10)] hover:bg-[oklch(0.70_0.25_10/10%)] hover:border-[oklch(0.70_0.25_10/30%)] hover:shadow-[0_0_8px_-2px_oklch(0.70_0.25_10/20%)]">
              <Heart
                size={14}
                className="transition-transform group-hover:scale-110"
              />
              <span>Like</span>
            </button>
            <button className="group flex items-center gap-1.5 border border-border/60 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground/60 transition-all hover:text-[oklch(0.75_0.20_155)] hover:bg-[oklch(0.75_0.20_155/10%)] hover:border-[oklch(0.75_0.20_155/30%)] hover:shadow-[0_0_8px_-2px_oklch(0.75_0.20_155/20%)]">
              <Repeat2
                size={14}
                className="transition-transform group-hover:scale-110"
              />
              <span>Repost</span>
            </button>
            <button className="group flex items-center gap-1.5 border border-border/60 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground/60 transition-all hover:text-accent hover:bg-accent/10 hover:border-accent/30 hover:shadow-[0_0_8px_-2px_oklch(0.72_0.19_195/20%)]">
              <MessageCircle
                size={14}
                className="transition-transform group-hover:scale-110"
              />
              <span>Comment</span>
            </button>
            <button className="group flex items-center gap-1.5 border border-border/60 rounded-full p-1.5 text-muted-foreground/60 transition-all hover:text-warm hover:bg-[oklch(0.80_0.18_65/10%)] hover:border-[oklch(0.80_0.18_65/30%)] hover:shadow-[0_0_8px_-2px_oklch(0.80_0.18_65/20%)] ml-auto">
              <Bookmark
                size={14}
                className="transition-transform group-hover:scale-110"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
