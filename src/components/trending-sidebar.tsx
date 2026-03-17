/** Sidebar displaying trending topics */
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
    <div className="rounded-xl border border-border bg-card p-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
        Trending
      </h3>
      <ul className="space-y-0.5">
        {TRENDING_TOPICS.map(({ tag, posts }) => (
          <li
            key={tag}
            className="rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-muted/50 cursor-pointer group">
            <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
              {tag}
            </span>
            <p className="text-[11px] text-muted-foreground">{posts}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
