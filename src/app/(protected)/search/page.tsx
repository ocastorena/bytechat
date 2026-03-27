"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useState, useCallback, Suspense } from "react"
import Feed from "@/components/feed"
import { ROUTES } from "@/config/constants"

/** Search input for the search page */
function SearchInput({
  value,
  onSearch,
}: {
  value: string
  onSearch: (query: string) => void
}) {
  const [input, setInput] = useState(value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(input.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search posts..."
        autoFocus
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-card text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 transition-all placeholder:text-muted-foreground/80"
      />
    </form>
  )
}

/** Empty state shown when no search query is provided */
function SearchEmpty() {
  return (
    <div className="py-16 text-center">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent/15 mb-4 shadow-[0_0_12px_-2px_oklch(0.72_0.19_195/25%)]">
        <Search className="h-7 w-7 text-accent" />
      </div>
      <h2 className="text-xl font-bold text-foreground">Search</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Search for posts, topics, and conversations.
      </p>
    </div>
  )
}

/** Inner component that reads search params */
function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") ?? ""

  const handleSearch = useCallback(
    (newQuery: string) => {
      if (newQuery) {
        router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(newQuery)}`)
      } else {
        router.push(ROUTES.SEARCH)
      }
    },
    [router]
  )

  return (
    <div className="max-w-xl mx-auto w-full flex flex-col gap-3 pt-4 px-4">
      <SearchInput value={query} onSearch={handleSearch} />

      {query ? (
        <>
          <p className="text-sm text-muted-foreground px-1">
            Results for <span className="text-foreground font-medium">&ldquo;{query}&rdquo;</span>
          </p>
          <Feed query={query} />
        </>
      ) : (
        <SearchEmpty />
      )}
    </div>
  )
}

/** Search page with post search functionality */
export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  )
}
