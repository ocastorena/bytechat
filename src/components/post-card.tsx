"use client"

import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import OverflowMenu from "./overflow-menu"
import { formatDate } from "@/lib/utils"
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
    <article className="animate-fade-in-up px-1 py-4 border-b border-border hover:bg-muted/20 transition-colors duration-150">
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
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold text-sm text-foreground truncate">
                {post.authorUsername}
              </span>
              <span className="text-muted-foreground/60 text-xs truncate">
                @{post.authorUsername}
              </span>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-muted-foreground/50 text-xs shrink-0">
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
          <p className="text-sm leading-relaxed mt-1">{post.content}</p>

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
                  className="relative w-full overflow-hidden rounded-xl border border-border"
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

          {/* Actions with engagement counts */}
          <div className="flex items-center gap-1 mt-3 -ml-2">
            <button className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground/70 transition-all hover:text-rose-500 hover:bg-rose-500/10">
              <Heart
                size={15}
                className="transition-transform group-hover:scale-110"
              />
              <span className="text-[11px] tabular-nums">0</span>
            </button>
            <button className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground/70 transition-all hover:text-accent hover:bg-accent/10">
              <MessageCircle
                size={15}
                className="transition-transform group-hover:scale-110"
              />
              <span className="text-[11px] tabular-nums">0</span>
            </button>
            <button className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground/70 transition-all hover:text-emerald-500 hover:bg-emerald-500/10">
              <Share2
                size={15}
                className="transition-transform group-hover:scale-110"
              />
            </button>
            <button className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground/70 transition-all hover:text-amber-500 hover:bg-amber-500/10 ml-auto">
              <Bookmark
                size={15}
                className="transition-transform group-hover:scale-110"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
