import Link from "next/link"
import { ROUTES } from "@/config/constants"
import { BytechatLogo } from "@/components/bytechat-logo"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <BytechatLogo className="opacity-50" />
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">Page not found</h2>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
      </div>
      <Link
        href={ROUTES.HOME}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors">
        Go home
      </Link>
    </div>
  )
}
