import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma" // your singleton
import { auth } from "@/lib/auth" // protect if needed
import { z } from "zod"

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
  const userId = searchParams.get("userId") // optional filter

  try {
    const baseWhere = userId ? { authorId: userId } : {}

    const posts = await prisma.post.findMany({
      take: limit + 1,
      orderBy: { createdAt: "desc" },
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where: baseWhere,
      include: {
        author: { select: { username: true } },
        images: {
          select: { id: true, url: true, altText: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    })

    let nextCursor: string | null = null
    if (posts.length > limit) {
      const nextItem = posts.pop()
      nextCursor = nextItem?.id ?? null
    }

    const safePosts = posts.map((p) => ({
      id: p.id,
      content: p.content,
      createdAt: p.createdAt.toISOString(),
      authorId: p.authorId,
      authorName: p.author?.username ?? "Unknown",
      images: (p.images ?? []).map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText ?? undefined,
        order: img.order,
      })),
    }))

    return NextResponse.json({
      data: safePosts,
      nextCursor,
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
        createdAt: newPost.createdAt.toISOString(),
        authorId: session.user.id,
        authorName: newPost.author.username,
        images: [],
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
