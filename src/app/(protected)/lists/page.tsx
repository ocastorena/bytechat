import { List } from "lucide-react"

/** Placeholder page for curated Lists */
export default function ListsPage() {
  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent/15 mb-4">
        <List className="h-7 w-7 text-accent" />
      </div>
      <h1 className="text-xl font-bold text-foreground">Lists</h1>
      <p className="text-muted-foreground text-sm mt-2">
        Create and manage curated lists. Coming soon.
      </p>
    </div>
  )
}
