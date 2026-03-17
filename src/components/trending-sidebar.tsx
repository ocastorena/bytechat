import { Settings } from "lucide-react"

/** Sidebar displaying trending topics */
const TRENDING_TOPICS = [
  { tag: "#BugBounty", category: "Security", posts: "18.3K posts" },
  { tag: "#CTF", category: "Security", posts: "14.1K posts" },
  { tag: "#RustLang", category: "Technology", posts: "11.7K posts" },
  { tag: "#ZeroDay", category: "Security", posts: "9.4K posts" },
  { tag: "#HomeServer", category: "Technology", posts: "7.8K posts" },
  { tag: "#OpenSource", category: "Technology", posts: "22.6K posts" },
  { tag: "#NixOS", category: "Technology", posts: "5.2K posts" },
]

export function TrendingSidebar() {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-foreground">
          Trends for you
        </h3>
        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <Settings size={16} />
        </button>
      </div>
      <ul className="space-y-0.5">
        {TRENDING_TOPICS.map(({ tag, category, posts }) => (
          <li
            key={tag}
            className="rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-muted/50 cursor-pointer group">
            <p className="text-[11px] text-muted-foreground">
              {category} · Trending
            </p>
            <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
              {tag}
            </span>
            <p className="text-[11px] text-muted-foreground">{posts}</p>
          </li>
        ))}
      </ul>
      <button className="mt-3 px-2 text-sm text-accent hover:text-accent/80 font-medium transition-colors">
        Show more
      </button>
    </div>
  )
}
