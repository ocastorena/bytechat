"use client"

import Feed from "@/components/feed"
import { CreatePostForm } from "@/components/create-post-form"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { SuggestedUsersSidebar } from "@/components/suggested-users-sidebar"

export function HomeContent() {
  return (
    <main className="flex justify-center gap-8 px-4 mt-4 max-w-6xl mx-auto w-full">
      {/* Feed column — single, centered */}
      <section className="w-full max-w-xl">
        <CreatePostForm />
        <Feed />
      </section>

      {/* Right sidebar — only on xl screens */}
      <aside className="hidden xl:flex flex-col gap-4 w-72 shrink-0 sticky top-16 self-start max-h-[calc(100dvh-5rem)] overflow-y-auto">
        <TrendingSidebar />
        <SuggestedUsersSidebar />
      </aside>
    </main>
  )
}
