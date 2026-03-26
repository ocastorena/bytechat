"use client"

import Feed from "@/components/feed"
import { CreatePostForm } from "@/components/create-post-form"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { SuggestedUsersSidebar } from "@/components/suggested-users-sidebar"
import { TrendingStrip } from "@/components/trending-strip"
import { SuggestedUsersStrip } from "@/components/suggested-users-strip"
import { ComposeButton } from "@/components/compose-button"
import { isDemoMode } from "@/lib/demo"

export function HomeContent() {
  return (
    <main className="flex justify-center gap-6 px-4 max-w-7xl mx-auto w-full">
      {/* Left sidebar — fixed position, never scrolls with page */}
      <div className="hidden lg:block w-64 xl:w-72 shrink-0">
        <aside className="fixed w-64 xl:w-72 top-[4.5rem] flex flex-col gap-4 max-h-[calc(100dvh-5.5rem)] overflow-y-auto sidebar-scroll">
          <SuggestedUsersSidebar />
        </aside>
      </div>

      {/* Center feed */}
      <section className="w-full max-w-xl flex flex-col gap-3 pt-4">
        {/* Discovery strips — visible when sidebars are hidden */}
        <TrendingStrip />
        <SuggestedUsersStrip />

        {/* Inline compose — hidden on mobile where FAB handles it */}
        {isDemoMode ? (
          <div className="hidden sm:block p-4 rounded-xl bg-card text-center text-sm text-muted-foreground">
            This is a read-only demo
          </div>
        ) : (
          <div className="hidden sm:block">
            <CreatePostForm />
          </div>
        )}
        <Feed />
      </section>

      {/* Right sidebar — fixed position, never scrolls with page */}
      <div className="hidden lg:block w-64 xl:w-72 shrink-0">
        <aside className="fixed w-64 xl:w-72 top-[4.5rem] flex flex-col gap-4 max-h-[calc(100dvh-5.5rem)] overflow-y-auto sidebar-scroll">
          <TrendingSidebar />
        </aside>
      </div>

      {/* FAB — mobile only, hidden in demo mode */}
      {!isDemoMode && <ComposeButton />}
    </main>
  )
}
