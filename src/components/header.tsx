"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Search, Compass, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { BytechatLogo } from "./bytechat-logo"
import { UserMenu } from "./user-menu"
import { ROUTES } from "@/config/constants"

/** Navigation link — uniform icon button, active gets accent tint */
function NavLink({
  href,
  icon: Icon,
  isActive,
}: {
  href: string
  icon: typeof Home
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative p-2 rounded-full transition-colors duration-150",
        isActive
          ? "text-accent bg-accent/15"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      )}>
      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()

  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-50 px-4 h-14 bg-background/80 backdrop-blur-xl">
      {/* Mobile header — centered logo */}
      <div className="flex sm:hidden items-center justify-center h-full">
        <BytechatLogo className="h-9 w-auto" />
      </div>

      {/* Desktop header — logo left, nav+user right */}
      <div className="hidden sm:flex items-center justify-between h-full">
        <div className="flex items-center gap-3 shrink-0">
          <BytechatLogo className="h-9 w-auto" />
        </div>

        {/* Right side — nav pill + user menu */}
        <div className="flex items-center gap-3">
          {/* Page navigation pill */}
          <nav className="flex items-center gap-0.5 rounded-full bg-card/60 border border-border/40 px-1.5 py-1 shrink-0">
            <NavLink
              href={ROUTES.HOME}
              icon={Home}
              isActive={pathname === ROUTES.HOME}
            />
            <NavLink
              href={ROUTES.EXPLORE}
              icon={Compass}
              isActive={pathname === ROUTES.EXPLORE}
            />
            <NavLink
              href={ROUTES.LISTS}
              icon={List}
              isActive={pathname === ROUTES.LISTS}
            />
            <NavLink
              href={ROUTES.SEARCH}
              icon={Search}
              isActive={pathname === ROUTES.SEARCH}
            />
          </nav>

          {/* User dropdown */}
          <div className="shrink-0">
            <UserMenu variant="header" />
          </div>
        </div>
      </div>
    </header>
  )
}
