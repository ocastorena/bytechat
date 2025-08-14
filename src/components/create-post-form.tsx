"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useState } from "react"
import { z } from "zod"
import { mutate } from "swr"
import { getInitials } from "@/lib/utils"
import { useSession } from "next-auth/react"

const postSchema = z.object({
  content: z.string().min(1, { message: "Post can’t be empty" }),
})

export function CreatePostForm() {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // 1) Validate client-side
    const result = postSchema.safeParse({ content })
    if (!result.success) {
      toast.error(z.flattenError(result.error).fieldErrors.content)
      return
    }

    setLoading(true)
    try {
      // 2) Call the POST API
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Unknown error")
      }

      // 3) Clear the input & revalidate the feed
      setContent("")
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
    <div>
      <Card className="flex flex-row items-center gap-3 pl-6 pr-6 ml-2 mr-2 mb-2">
        <Avatar className="h-10 w-10 border-2 border-background shadow-lg">
          <AvatarImage
            src={session?.user?.image || undefined}
            alt={session?.user?.name || "User"}
          />
          <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {session?.user?.name ? getInitials(session.user.name) : "U"}
          </AvatarFallback>
        </Avatar>
        <CardContent className="w-full p-0">
          <form
            onSubmit={handleSubmit}
            className="flex flex-row items-center gap-3">
            <Input
              id="post"
              type="text"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => {
                setContent(e.currentTarget.value)
              }}
              className="h-10"
            />
            <Button
              type="submit"
              disabled={loading}
              variant="secondary"
              size="lg">
              {loading ? "Posting..." : "Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
