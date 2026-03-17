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

/** Form for composing and submitting a new post */
export function CreatePostForm() {
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
      <div className="flex gap-3 px-1">
        <Avatar className="h-9 w-9 shrink-0 mt-1">
          <AvatarImage
            src={session?.user?.image || undefined}
            alt={session?.user?.name || "User"}
          />
          <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
            {session?.user?.name ? getInitials(session.user.name) : "U"}
          </AvatarFallback>
        </Avatar>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            id="post"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => {
              setContent(e.currentTarget.value)
              autoResize()
            }}
            rows={2}
            className="w-full resize-none rounded-lg bg-muted/40 border border-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:bg-background focus:border-border transition-all"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !content.trim()}
              size="sm"
              className="rounded-full px-5 h-8 text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40">
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
