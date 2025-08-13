import Feed from "@/components/feed"
import CreatePostForm from "@/components/create-post-form"
import { Card } from "@/components/ui/card"

export default function Page() {
  return (
    <main className="grid grid-cols-12 gap-6 px-6">
      <aside className="col-span-3">
        <Card className="sticky top-26 h-[calc(100dvh-8rem)]  w-full"></Card>
      </aside>
      <section className="col-span-6 mt-6">
        <CreatePostForm />
        <Feed />
      </section>
      <aside className="col-span-3">
        <Card className="sticky top-26 h-[calc(100dvh-8rem)] w-full"></Card>
      </aside>
    </main>
  )
}
