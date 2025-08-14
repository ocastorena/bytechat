import Feed from "@/components/feed"
import { CreatePostForm } from "@/components/create-post-form"
import { Card } from "@/components/ui/card"

export default function Page() {
  return (
    <main className="grid grid-cols-12 gap-6 px-6 mt-6">
      <aside className="col-span-3">
        <Card className="sticky top-26 h-[calc(100dvh-8rem)]  w-full">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Trending Topics</h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {[
                { tag: "#NextJS15", posts: "12.4K posts" },
                { tag: "#TypeScript", posts: "8.9K posts" },
                { tag: "#RemoteWork", posts: "6.2K posts" },
                { tag: "#OpenAI", posts: "15.7K posts" },
                { tag: "#WebDev", posts: "22.1K posts" },
                { tag: "#CoffeeChat", posts: "3.8K posts" },
                { tag: "#TechInterview", posts: "5.4K posts" },
              ].map(({ tag, posts }) => (
                <li
                  key={tag}
                  className="rounded-md px-2 py-1 transition-colors duration-200 hover:bg-muted hover:text-foreground cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{tag}</span>
                    <span className="text-xs text-muted-foreground">
                      {posts}
                    </span>
                  </div>
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
                {
                  name: "Sarah Chen",
                  username: "@sarahbuilds",
                  initials: "SC",
                  bio: "Senior Frontend Engineer at Vercel",
                  verified: true,
                },
                {
                  name: "Alex Rivera",
                  username: "@alexcodes",
                  initials: "AR",
                  bio: "Full-stack dev & tech blogger",
                  verified: false,
                },
                {
                  name: "Maya Patel",
                  username: "@mayatech",
                  initials: "MP",
                  bio: "AI/ML Engineer, Python enthusiast",
                  verified: true,
                },
                {
                  name: "Jordan Kim",
                  username: "@jordanux",
                  initials: "JK",
                  bio: "UX Designer turning code into art",
                  verified: false,
                },
              ].map(({ name, username, initials, bio, verified }) => (
                <li key={username}>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-medium text-sm">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-foreground truncate">
                          {name}
                        </span>
                        {verified && (
                          <svg
                            className="h-3 w-3 text-blue-500 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs truncate">
                        {username}
                      </p>
                      <p className="text-muted-foreground text-xs leading-tight mt-1">
                        {bio}
                      </p>
                      <button className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                        Follow
                      </button>
                    </div>
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
