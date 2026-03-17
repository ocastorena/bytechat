"use client"

import Feed from "@/components/feed"
import { CreatePostForm } from "@/components/create-post-form"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { SuggestedUsersSidebar } from "@/components/suggested-users-sidebar"
import { ComposeButton } from "@/components/compose-button"
import { ProfileCard } from "@/components/profile-card"

export function HomeContent() {
  return (
    <main className="flex justify-center gap-6 px-4 mt-4 max-w-7xl mx-auto w-full">
      {/* Left sidebar — profile + suggestions */}
      <aside className="hidden xl:flex flex-col gap-4 w-72 shrink-0 sticky top-[3.75rem] self-start max-h-[calc(100dvh-5rem)] overflow-y-auto">
        <ProfileCard />
        <SuggestedUsersSidebar />
      </aside>

      {/* Center feed */}
      <section className="w-full max-w-xl">
        {/* Inline compose — hidden on mobile */}
        <div className="hidden sm:block">
          <CreatePostForm />
        </div>
        <Feed />
      </section>

      {/* Right sidebar — trending */}
      <aside className="hidden xl:flex flex-col gap-4 w-72 shrink-0 sticky top-[3.75rem] self-start max-h-[calc(100dvh-5rem)] overflow-y-auto">
        <TrendingSidebar />
      </aside>

      {/* FAB — mobile only */}
      <ComposeButton />
    </main>
  )
}
