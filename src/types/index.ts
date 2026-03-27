export type Post = {
  id: string
  authorUsername: string
  content: string
  authorId: string
  createdAt: string
  images: { id: string; url: string; altText?: string; order: number }[]
}

export type PostPage = {
  data: Post[]
  nextCursor?: string | null
}
