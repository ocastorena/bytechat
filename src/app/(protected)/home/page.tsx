import Feed from "@/components/feed"
import CreatePostForm from "@/components/create-post-form"
import { Card } from "@/components/ui/card"

export default function Page() {
  return (
    <main className="grid grid-cols-12 gap-6 px-6 mt-6">
      <aside className="col-span-3">
        <Card className="sticky top-26 h-[calc(100dvh-8rem)]  w-full">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Trending Topics</h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {["#TechNews", "#StartupLife", "#DevTalk", "#AIRevolution", "#CyberpunkStyle"].map((topic) => (
                <li
                  key={topic}
                  className="rounded-md px-2 py-1 transition-colors duration-200 hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </aside>
      <section className="col-span-6">
        <CreatePostForm />
        <Feed />
      </section>
      <aside className="col-span-3">
        <Card className="sticky top-26 h-[calc(100dvh-8rem)] w-full">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Who to Follow</h2>
            <ul className="space-y-3 text-sm">
              {[
                { username: "@codewizard", initials: "CW" },
                { username: "@frontendqueen", initials: "FQ" },
                { username: "@dev_guru", initials: "DG" },
              ].map(({ username, initials }) => (
                <li key={username}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted text-foreground flex items-center justify-center font-medium">
                      {initials}
                    </div>
                    <span className="text-muted-foreground">{username}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </aside>
    </main>
  )
}
