import Feed from "@/components/feed"
import { CreatePostForm } from "@/components/create-post-form"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { SuggestedUsersSidebar } from "@/components/suggested-users-sidebar"

export default function Page() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 mt-6">
      <aside className="hidden lg:block lg:col-span-3">
        <TrendingSidebar />
      </aside>
      <section className="col-span-1 lg:col-span-6">
        <CreatePostForm />
        <Feed />
      </section>
      <aside className="hidden lg:block lg:col-span-3">
        <SuggestedUsersSidebar />
      </aside>
    </main>
  )
}
