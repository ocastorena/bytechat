"use client"

import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react"
import OverflowMenu from "./overflow-menu"
import { cn, formatDate, formatDateFull, getAvatarUrl } from "@/lib/utils"
import type { Post } from "@/types"
import { isDemoMode } from "@/lib/demo"

/** Props for the PostCard component */
interface PostCardProps {
  post: Post
  isOwnPost: boolean
  onDelete?: (postId: string) => void
}

/** Formats a number for display (e.g. 1500 → "1.5k") */
function formatCount(n: number) {
  return n > 999 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

/** Generates deterministic engagement numbers from post content */
function getEngagement(content: string) {
  const seed = content.length + content.charCodeAt(0)
  const likes = ((seed * 137) % 900) + 100
  const reposts = ((seed * 71) % 400) + 20
  const bookmarks = ((seed * 29) % 200) + 10
  const comments = ((seed * 53) % 80) + 5
  return { likes, reposts, bookmarks, comments }
}

/** Renders a single post in the feed */
export function PostCard({ post, isOwnPost, onDelete }: PostCardProps) {
  const engagement = getEngagement(post.content)

  return (
    <article className="p-3 sm:p-4 rounded-xl bg-card hover:bg-card/90 transition-colors duration-150">
      {/* Mobile: stacked layout — author row then full-width content */}
      {/* Desktop: side-by-side with avatar column */}
      <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-3">
        {/* Author row (mobile) / Avatar column (desktop) */}
        <div className="flex items-center gap-2 sm:block">
          <Avatar className="h-7 w-7 sm:h-10 sm:w-10 shrink-0">
            <AvatarImage
              src={getAvatarUrl(post.authorUsername)}
              alt={post.authorUsername}
            />
            <AvatarFallback className="text-[10px] sm:text-sm font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
              {post.authorUsername.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Author info — inline on mobile, below avatar on desktop */}
          <div className="flex sm:hidden items-baseline gap-1 min-w-0 flex-1">
            <span className="font-semibold text-sm text-foreground truncate">
              {post.authorUsername}
            </span>
            <span className="text-muted-foreground/60 text-xs font-mono truncate">
              @{post.authorUsername}
            </span>
            <span className="text-muted-foreground/40 text-xs mx-0.5">·</span>
            <span
              className="text-muted-foreground/60 text-xs cursor-default shrink-0"
              title={formatDateFull(post.createdAt)}>
              {formatDate(post.createdAt)}
            </span>
          </div>
          {!isDemoMode && isOwnPost && onDelete && (
            <div className="sm:hidden shrink-0">
              <OverflowMenu
                postId={post.id}
                isOwnPost={isOwnPost}
                onDelete={onDelete}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Author line — desktop only */}
          <div className="hidden sm:flex items-start justify-between">
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-base text-foreground truncate">
                  {post.authorUsername}
                </span>
                <span className="text-muted-foreground/60 text-sm font-mono truncate">
                  @{post.authorUsername}
                </span>
              </div>
              <span
                className="text-muted-foreground/60 text-xs cursor-default"
                title={formatDateFull(post.createdAt)}>
                {formatDate(post.createdAt)}
              </span>
            </div>

            {!isDemoMode && isOwnPost && onDelete && (
              <OverflowMenu
                postId={post.id}
                isOwnPost={isOwnPost}
                onDelete={onDelete}
              />
            )}
          </div>

          {/* Post body */}
          <p className="text-sm sm:text-[15px] leading-relaxed sm:mt-1">{post.content}</p>

          {/* Images — adaptive grid: 1=full, 2=side-by-side, 3=1+2, 4=2x2 */}
          {post.images && post.images.length > 0 && (
            <div
              className={cn(
                "mt-3 grid gap-0.5 overflow-hidden rounded-2xl border border-border",
                post.images.length === 1 && "grid-cols-1",
                post.images.length === 2 && "grid-cols-2",
                post.images.length === 3 && "grid-cols-2 grid-rows-2",
                post.images.length >= 4 && "grid-cols-2 grid-rows-2",
              )}>
              {post.images.slice(0, 4).map((img, idx) => (
                <div
                  key={img.id}
                  className={cn(
                    "relative w-full overflow-hidden",
                    post.images.length === 3 && idx === 0 && "row-span-2",
                  )}
                  style={{
                    aspectRatio: post.images.length === 1 ? "16 / 9" : "3 / 2",
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

          {/* Actions — Like, Repost, Bookmark, Comment */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
            <button className="flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-muted-foreground bg-background hover:bg-[oklch(0.70_0.25_10/10%)] transition-colors duration-150">
              <Heart size={13} className="text-[oklch(0.70_0.25_10)] sm:size-[14px]" />
              <span>{formatCount(engagement.likes)}</span>
            </button>
            <button className="flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-muted-foreground bg-background hover:bg-[oklch(0.72_0.19_250/10%)] transition-colors duration-150">
              <Repeat2 size={13} className="text-[oklch(0.72_0.19_250)] sm:size-[14px]" />
              <span>{formatCount(engagement.reposts)}</span>
            </button>
            <button className="flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-muted-foreground bg-background hover:bg-[oklch(0.75_0.18_350/10%)] transition-colors duration-150">
              <Bookmark size={13} className="text-[oklch(0.75_0.18_350)] sm:size-[14px]" />
              <span>{formatCount(engagement.bookmarks)}</span>
            </button>
            <button className="flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-muted-foreground bg-background hover:bg-[oklch(0.72_0.19_140/10%)] transition-colors duration-150 ml-auto">
              <MessageCircle size={13} className="text-[oklch(0.72_0.19_140)] sm:size-[14px]" />
              <span>{formatCount(engagement.comments)}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
