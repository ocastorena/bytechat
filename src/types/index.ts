export type Post = {
  id: string
  authorName: string
  authorUsername: string
  content: string
  authorId: string
  createdAt: string
  images: { id: string; url: string; altText?: string }[]
}

export type PostPage = {
  data: Post[]
  nextCursor?: string | null
}
