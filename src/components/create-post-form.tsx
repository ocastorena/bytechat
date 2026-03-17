"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { useState, useRef, useCallback } from "react"
import { z } from "zod"
import { mutate } from "swr"
import { getInitials } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { postSchema } from "@/lib/validations"
import { apiClient } from "@/lib/api-client"
import { ImagePlus, Video, ListTree, Calendar } from "lucide-react"

/** Action pill buttons for the composer toolbar */
const COMPOSER_ACTIONS = [
  { icon: ImagePlus, label: "Photo" },
  { icon: Video, label: "Video" },
  { icon: ListTree, label: "Thread" },
  { icon: Calendar, label: "Schedule" },
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
    <div className="pb-3 mb-1 border-b border-border">
      <div className="flex gap-3 px-4">
        <Avatar className="h-10 w-10 shrink-0 mt-1">
          <AvatarImage
            src={session?.user?.image || undefined}
            alt={session?.user?.name || "User"}
          />
          <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
            {session?.user?.name ? getInitials(session.user.name) : "U"}
          </AvatarFallback>
        </Avatar>
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
            className="w-full resize-none bg-transparent border-none px-0 py-2.5 text-[15px] placeholder:text-muted-foreground/60 focus:outline-none transition-all leading-relaxed"
          />
          <div className="flex items-center justify-between border-t border-border/60 pt-2">
            {/* Action pills */}
            <div className="flex items-center gap-1.5">
              {COMPOSER_ACTIONS.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground border border-border/60 hover:bg-muted/50 hover:text-accent transition-colors">
                  <Icon size={14} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Character count + Post button */}
            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {content.length}/280
                </span>
              )}
              <Button
                type="submit"
                disabled={loading || !content.trim()}
                size="sm"
                className="rounded-full px-5 h-8 text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40">
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
