import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Post = {
  id: number
  author: string
  text: string
}

const mockPosts: Post[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  author: "User " + (i + 1),
  text: "This is a placeholder post for the feed. It demonstrates how each card will look inside the list.",
}))

export default function Feed({ className }: React.ComponentProps<"div">) {
  return (
    <section className={cn("mb-3", className)}>
      {mockPosts.map((post) => (
        <div key={post.id} className="flex flex-col gap-4 p-2">
          <Card>
            <CardHeader className="flex flex-row items-start gap-3">
              <Avatar className="h-10 w-10" />
              <div className="flex flex-col">
                <h3 className="font-medium">{post.author}</h3>
                <span className="text-sm text-muted-foreground">Just now</span>
              </div>
            </CardHeader>

            <CardContent>
              <p>{post.text}</p>
            </CardContent>

            <CardFooter className="gap-4">
              <Button variant="ghost" size="sm">
                Like
              </Button>
              <Button variant="ghost" size="sm">
                Comment
              </Button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </section>
  )
}
