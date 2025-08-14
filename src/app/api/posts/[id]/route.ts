import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma" // your singleton
import { auth } from "@/lib/auth" // protect if needed

// DELETE a post (only by the author)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      )
    }

    // Delete the post (this will also delete related images if you have cascade delete)
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[POST_DELETE]", error)
    return NextResponse.json(
      { error: "Unable to delete post" },
      { status: 500 }
    )
  }
}
