import Feed from "@/components/feed"
import { Card } from "@/components/ui/card"

export default function Page() {
  return (
    <main className="grid grid-cols-12 gap-6 px-6">
      <aside className="col-span-3">
        <Card className="sticky top-27 h-[calc(100dvh-8rem)]  w-full"></Card>
      </aside>

      <Feed className="col-span-6" />

      <aside className="col-span-3">
        <Card className="sticky top-27 h-[calc(100dvh-8rem)] w-full"></Card>
      </aside>
    </main>
  )
}
