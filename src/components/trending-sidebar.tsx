import { Card } from "@/components/ui/card"

const TRENDING_TOPICS = [
  { tag: "#BugBounty", posts: "18.3K posts" },
  { tag: "#CTF", posts: "14.1K posts" },
  { tag: "#RustLang", posts: "11.7K posts" },
  { tag: "#ZeroDay", posts: "9.4K posts" },
  { tag: "#HomeServer", posts: "7.8K posts" },
  { tag: "#OpenSource", posts: "22.6K posts" },
  { tag: "#NixOS", posts: "5.2K posts" },
]

export function TrendingSidebar() {
  return (
    <Card className="sticky top-20 w-full">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Trending Topics</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {TRENDING_TOPICS.map(({ tag, posts }) => (
            <li
              key={tag}
              className="rounded-md px-2 py-1 transition-colors duration-200 hover:bg-muted hover:text-accent cursor-pointer">
              <div className="flex flex-col">
                <span className="font-medium font-mono text-foreground">{tag}</span>
                <span className="text-xs text-muted-foreground">{posts}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
