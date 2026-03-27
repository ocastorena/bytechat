import { Settings, MoreHorizontal } from "lucide-react"
import { TRENDING_TOPICS } from "@/lib/mock-data"

export function TrendingSidebar() {
  return (
    <div className="bg-card rounded-xl p-4">
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
            className="rounded-xl px-2 py-2 transition-colors duration-150 hover:bg-muted/50 cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  {category} · Trending
                </p>
                <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                  {tag}
                </span>
                <p className="text-[11px] text-muted-foreground">{posts} posts</p>
              </div>
              <button className="p-1 rounded-lg text-muted-foreground/50 opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-muted/50 transition-all shrink-0 mt-0.5">
                <MoreHorizontal size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button className="mt-3 px-2 text-sm text-accent hover:text-accent/80 font-medium transition-colors">
        Show more
      </button>
    </div>
  )
}
