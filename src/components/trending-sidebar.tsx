import { Card } from "@/components/ui/card"

const TRENDING_TOPICS = [
  { tag: "#NextJS15", posts: "12.4K posts" },
  { tag: "#TypeScript", posts: "8.9K posts" },
  { tag: "#RemoteWork", posts: "6.2K posts" },
  { tag: "#OpenAI", posts: "15.7K posts" },
  { tag: "#WebDev", posts: "22.1K posts" },
  { tag: "#CoffeeChat", posts: "3.8K posts" },
  { tag: "#TechInterview", posts: "5.4K posts" },
]

export function TrendingSidebar() {
  return (
    <Card className="sticky top-26 h-[calc(100dvh-8rem)] w-full">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Trending Topics</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {TRENDING_TOPICS.map(({ tag, posts }) => (
            <li
              key={tag}
              className="rounded-md px-2 py-1 transition-colors duration-200 hover:bg-muted hover:text-foreground cursor-pointer">
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{tag}</span>
                <span className="text-xs text-muted-foreground">{posts}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
