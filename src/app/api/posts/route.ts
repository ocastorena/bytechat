import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { postSchema } from "@/lib/validations"
import {
  apiSuccess,
  apiError,
  apiValidationError,
  logApiError,
} from "@/lib/api-response"
import type { Post } from "@/types"

interface PrismaPostWithAuthor {
  id: string
  content: string
  createdAt: Date
  authorId: string
  author: { username: string } | null
  images?: { id: string; url: string; altText: string | null; order: number }[]
}

function transformPost(p: PrismaPostWithAuthor): Post {
  return {
    id: p.id,
    content: p.content,
    createdAt: p.createdAt.toISOString(),
    authorId: p.authorId,
    authorUsername: p.author?.username ?? "unknown",
    images: (p.images ?? []).map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText ?? undefined,
      order: img.order,
    })),
  }
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return apiError("Unauthorized", 401)
  }

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") ?? "10", 10)
  const cursor = searchParams.get("cursor")
  const userId = searchParams.get("userId")

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

    const safePosts = posts.map(transformPost)

    return apiSuccess({ data: safePosts, nextCursor })
  } catch (error) {
    logApiError("POST_GET", error)
    return apiError("Unable to fetch posts", 500)
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return apiError("Unauthorized", 401)
  }

  let content: string
  try {
    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return apiValidationError(parsed.error)
    }
    content = parsed.data.content
  } catch {
    return apiError("Invalid request", 400)
  }

  if (!session.user?.id) {
    return apiError("Unauthorized", 401)
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: session.user.id,
      },
      include: { author: { select: { username: true } } },
    })

    return apiSuccess(transformPost(newPost), 201)
  } catch (error) {
    logApiError("POST_CREATE", error)
    return apiError("Could not create post", 500)
  }
}
