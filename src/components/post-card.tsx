"use client"

import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react"
import OverflowMenu from "./overflow-menu"
import { cn, formatDate, formatDateFull } from "@/lib/utils"
import type { Post } from "@/types"

/** Props for the PostCard component */
interface PostCardProps {
  post: Post
  isOwnPost: boolean
  onDelete?: (postId: string) => void
}

/** Renders a single post in the feed */
export function PostCard({ post, isOwnPost, onDelete }: PostCardProps) {
  return (
    <article className="px-4 py-4 border-b border-border hover:bg-muted/20 transition-colors duration-150">
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
                className="text-muted-foreground/50 text-sm shrink-0 cursor-default"
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

          {/* Actions — Reply, Repost, Like, Bookmark */}
          <div className="flex items-center gap-1 mt-3 -ml-2">
            <button className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground/70 transition-all hover:text-accent hover:bg-accent/10">
              <MessageCircle
                size={16}
                className="transition-transform group-hover:scale-110"
              />
              <span className="text-xs tabular-nums">0</span>
            </button>
            <button className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground/70 transition-all hover:text-emerald-500 hover:bg-emerald-500/10">
              <Repeat2
                size={16}
                className="transition-transform group-hover:scale-110"
              />
              <span className="text-xs tabular-nums">0</span>
            </button>
            <button className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground/70 transition-all hover:text-rose-500 hover:bg-rose-500/10">
              <Heart
                size={16}
                className="transition-transform group-hover:scale-110"
              />
              <span className="text-xs tabular-nums">0</span>
            </button>
            <button className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground/70 transition-all hover:text-amber-500 hover:bg-amber-500/10 ml-auto">
              <Bookmark
                size={16}
                className="transition-transform group-hover:scale-110"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
