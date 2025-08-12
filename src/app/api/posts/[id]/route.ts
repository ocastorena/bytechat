import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma" // your singleton
import { auth } from "@/lib/auth" // protect if needed
import { z } from "zod"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const postId = params.id

  // Validate dynamic route id (basic); tighten to ObjectId regex if desired
  const idSchema = z
    .string()
    .min(1, { message: "Post id is required" })
    .refine((v) => /^[a-fA-F0-9]{24}$/.test(v), {
      message: "Invalid post id",
    })

  const parsed = idSchema.safeParse(postId)
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors.join(", ") || "Invalid id"
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  try {
    // Enforce ownership in the WHERE clause; deleteMany returns a count (idempotent & safe)
    const result = await prisma.post.deleteMany({
      where: { id: parsed.data, authorId: session.user!.id },
    })

    if (result.count === 0) {
      // Either not found or not owned by this user
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // No content on success
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[POST_DELETE]", error)
    return NextResponse.json(
      { error: "Could not delete post" },
      { status: 500 }
    )
  }
}
