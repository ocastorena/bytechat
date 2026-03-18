import { Compass } from "lucide-react"

/** Placeholder page for the Explore feed */
export default function ExplorePage() {
  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent/15 mb-4">
        <Compass className="h-7 w-7 text-accent" />
      </div>
      <h1 className="text-xl font-bold text-foreground">Explore</h1>
      <p className="text-muted-foreground text-sm mt-2">
        Discover trending posts and topics. Coming soon.
      </p>
    </div>
  )
}
