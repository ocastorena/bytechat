import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma" // your singleton
import { auth } from "@/lib/auth" // protect if needed
import { z, ZodError } from "zod"

export async function GET(request: NextRequest) {
  // check if request is authorized
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // pagination
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") ?? "10", 10)
  const cursor = searchParams.get("cursor")

  try {
    // query database
    const posts = await prisma.post.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      include: {
        author: { select: { username: true } },
      },
    })

    const safePosts = posts.map((p) => ({
      id: p.id,
      content: p.content,
      createdAt: p.createdAt,
      authorName: p.author?.username ?? "Unknown",
    }))

    return NextResponse.json({
      data: safePosts,
      nextCursor:
        safePosts.length === limit ? safePosts[safePosts.length - 1].id : null,
    })
  } catch (error) {
    console.error("[POST_GET]", error)
    return NextResponse.json(
      { error: "Unable to fetch posts" },
      { status: 500 }
    )
  }
}

// 1) Define a Zod schema for post data
const postSchema = z.object({
  content: z.string().min(1, { message: "Post can’t be empty" }),
})

export async function POST(request: NextRequest) {
  // check if request is authorized
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2) Validate incoming JSON (safeParse to collect messages)
  let content: string
  try {
    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      const flat = parsed.error.flatten()
      const messages = [
        ...flat.formErrors,
        ...Object.values(flat.fieldErrors).flat(),
      ].filter(Boolean) as string[]
      return NextResponse.json(
        { error: messages.join(", ") || "Invalid request" },
        { status: 400 }
      )
    }
    content = parsed.data.content
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Ensure we have a user id
  if (!session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: session.user.id,
      },
      include: { author: { select: { username: true } } },
    })

    // 4) Shape the response like GET
    return NextResponse.json(
      {
        id: newPost.id,
        content: newPost.content,
        createdAt: newPost.createdAt,
        authorName: newPost.author.username,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST_CREATE]", error)
    return NextResponse.json(
      { error: "Could not create post" },
      { status: 500 }
    )
  }
}
