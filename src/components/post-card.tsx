import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import OverflowMenu from "./overflow-menu"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/types"

interface PostCardProps {
  post: Post
  isOwnPost: boolean
  onDelete?: (postId: string) => void
}

export function PostCard({ post, isOwnPost, onDelete }: PostCardProps) {
  return (
    <div className="flex flex-col gap-4 p-2">
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {post.authorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-sm">
                    {post.authorName}
                  </h3>
                  <span className="text-gray-500 text-sm">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {isOwnPost && onDelete && (
              <OverflowMenu
                postId={post.id}
                isOwnPost={isOwnPost}
                onDelete={onDelete}
              />
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
            {post.content}
          </p>

          {post.images && post.images.length > 0 && (
            <div
              className={
                post.images.length > 1
                  ? "mt-3 grid gap-2 sm:grid-cols-2"
                  : "mt-3 grid gap-2"
              }>
              {post.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative w-full overflow-hidden rounded-lg"
                  style={{
                    aspectRatio:
                      post.images.length > 1 ? "4 / 3" : "16 / 9",
                  }}>
                  <Image
                    src={img.url}
                    alt={img.altText || ""}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                    className="object-cover"
                    loading={idx === 0 ? "eager" : "lazy"}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
