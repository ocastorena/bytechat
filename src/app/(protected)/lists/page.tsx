import { List } from "lucide-react"

/** Placeholder page for curated Lists */
export default function ListsPage() {
  return (
    <div className="max-w-xl mx-auto py-16">
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent/15 mb-4 shadow-[0_0_12px_-2px_oklch(0.72_0.19_195/25%)]">
          <List className="h-7 w-7 text-accent" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Lists</h1>
        <p className="text-muted-foreground text-sm mt-2">
          Create and manage curated lists.
        </p>
        <span className="inline-block mt-3 text-xs bg-accent/10 text-accent rounded-full px-3 py-1 font-medium">
          Coming soon
        </span>
      </div>
    </div>
  )
}
