"use client"

import { Card, CardContent } from "@/components/ui/card"
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
    <Card className="px-6 py-4 mb-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0 border-2 border-background shadow-lg">
          <AvatarImage
            src={session?.user?.image || undefined}
            alt={session?.user?.name || "User"}
          />
          <AvatarFallback className="text-xl font-bold bg-linear-to-br from-blue-500 to-purple-600 text-white">
            {session?.user?.name ? getInitials(session.user.name) : "U"}
          </AvatarFallback>
        </Avatar>
        <CardContent className="w-full p-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 font-mono text-sm placeholder:text-accent/40 focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent/50 focus:shadow-[0_0_10px_-3px] focus:shadow-accent/15 transition-shadow"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                variant="secondary"
                size="sm">
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
    </Card>
  )
}
