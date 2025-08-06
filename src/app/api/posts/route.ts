import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma" // your singleton
import { auth } from "@/lib/auth" // protect if needed

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
