import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { apiSuccess, apiError, logApiError } from "@/lib/api-response"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError("Unauthorized", 401)
  }

  try {
    const { id } = await params

    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existingPost) {
      return apiError("Post not found", 404)
    }

    if (existingPost.authorId !== session.user.id) {
      return apiError("You can only delete your own posts", 403)
    }

    await prisma.post.delete({
      where: { id },
    })

    return apiSuccess({ message: "Post deleted successfully" })
  } catch (error) {
    logApiError("POST_DELETE", error)
    return apiError("Unable to delete post", 500)
  }
}
