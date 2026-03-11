import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ROUTES } from "@/config/constants"

export default async function RootPage() {
  const session = await auth()
  if (session) redirect(ROUTES.HOME)
  redirect(ROUTES.LOGIN)
}
