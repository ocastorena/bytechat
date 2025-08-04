import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth()
  if (!session?.user) return null
  return (
    <main>
      <h1>{session.user.email}</h1>
    </main>
  )
}
