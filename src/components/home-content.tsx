"use client"

import { useState } from "react"
import Feed from "@/components/feed"
import { CreatePostForm } from "@/components/create-post-form"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { SuggestedUsersSidebar } from "@/components/suggested-users-sidebar"

type MobileTab = "feed" | "trending" | "people"

export function HomeContent() {
  const [mobileTab, setMobileTab] = useState<MobileTab>("feed")

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-6 mt-4 sm:mt-6 max-w-7xl mx-auto w-full">
      <aside className="hidden lg:block lg:col-span-3">
        <TrendingSidebar />
      </aside>

      <section className="col-span-1 lg:col-span-6">
        <div className="flex gap-1 p-1 mb-4 bg-muted rounded-lg lg:hidden">
          {([
            { key: "feed", label: "Feed" },
            { key: "trending", label: "Trending" },
            { key: "people", label: "People" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMobileTab(key)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                mobileTab === key
                  ? "bg-background text-accent shadow-sm border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              {label}
            </button>
          ))}
        </div>

        <div className="hidden lg:block">
          <CreatePostForm />
          <Feed />
        </div>

        <div className="lg:hidden">
          {mobileTab === "feed" && (
            <>
              <CreatePostForm />
              <Feed />
            </>
          )}
          {mobileTab === "trending" && <TrendingSidebar />}
          {mobileTab === "people" && <SuggestedUsersSidebar />}
        </div>
      </section>

      <aside className="hidden lg:block lg:col-span-3">
        <SuggestedUsersSidebar />
      </aside>
    </main>
  )
}
