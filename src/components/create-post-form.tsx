"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useState, useRef, useCallback } from "react"
import { z } from "zod"
import { mutate } from "swr"
import { getInitials, getAvatarUrl } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { postSchema } from "@/lib/validations"
import { apiClient } from "@/lib/api-client"
import { ImagePlus, Video, ListTree, Calendar } from "lucide-react"

/** Action pill buttons for the composer toolbar */
const COMPOSER_ACTIONS = [
  {
    icon: ImagePlus,
    label: "Photo",
    color: "text-[oklch(0.75_0.20_155)]",
    hover: "hover:bg-[oklch(0.75_0.20_155/10%)]",
  },
  {
    icon: Video,
    label: "Video",
    color: "text-[oklch(0.72_0.19_195)]",
    hover: "hover:bg-[oklch(0.72_0.19_195/10%)]",
  },
  {
    icon: ListTree,
    label: "Thread",
    color: "text-[oklch(0.70_0.25_310)]",
    hover: "hover:bg-[oklch(0.70_0.25_310/10%)]",
  },
  {
    icon: Calendar,
    label: "Schedule",
    color: "text-[oklch(0.80_0.18_65)]",
    hover: "hover:bg-[oklch(0.80_0.18_65/10%)]",
  },
] as const

/** Props for the CreatePostForm component */
interface CreatePostFormProps {
  /** Callback fired after a successful post submission */
  onSuccess?: () => void
}

/** Form for composing and submitting a new post */
export function CreatePostForm({ onSuccess }: CreatePostFormProps = {}) {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    const result = postSchema.safeParse({ content })
    if (!result.success) {
      toast.error(z.flattenError(result.error).fieldErrors.content)
      return
    }

    setLoading(true)
    try {
      await apiClient.posts.create(content)
      setContent("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
      toast.success("Post created!")
      mutate((key) => typeof key === "string" && key.startsWith("/api/posts"))
      onSuccess?.()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-3 sm:p-4 rounded-xl bg-card">
      {/* Mobile: stacked layout — avatar row then full-width textarea */}
      {/* Desktop: side-by-side layout */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Avatar — inline with name on mobile, column on desktop */}
        <div className="flex sm:block items-center gap-2">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 sm:mt-1">
            <AvatarImage
              src={session?.user?.image || getAvatarUrl(session?.user?.name || "user")}
              alt={session?.user?.name || "User"}
            />
            <AvatarFallback className="text-xs sm:text-sm font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
              {session?.user?.name ? getInitials(session.user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <span className="sm:hidden text-sm font-semibold text-foreground">
            {session?.user?.name || "User"}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            id="post"
            placeholder="What's happening?"
            value={content}
            onChange={(e) => {
              setContent(e.currentTarget.value)
              autoResize()
            }}
            rows={2}
            className="w-full resize-none bg-muted/50 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-[15px] placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all leading-relaxed"
          />
          <div className="flex items-center gap-1 sm:gap-1.5 pt-1 sm:pt-2">
            {/* Action pills with colored icons */}
            {COMPOSER_ACTIONS.map(({ icon: Icon, label, color, hover }) => (
              <button
                key={label}
                type="button"
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-muted-foreground bg-background ${hover} transition-colors`}>
                <Icon size={14} className={color} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}

            {/* Character count + Post button */}
            {content.length > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                {content.length}/280
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 rounded-full px-5 h-8 text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_0_10px_-2px_oklch(0.72_0.19_195/30%)] hover:shadow-[0_0_14px_-2px_oklch(0.72_0.19_195/40%)] transition-all">
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
