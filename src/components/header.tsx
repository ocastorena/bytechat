"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Search, Compass, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { BytechatLogo } from "./bytechat-logo"
import { UserMenu } from "./user-menu"
import { ROUTES } from "@/config/constants"

/** Clean search input */
function SearchBar() {
  return (
    <div className="relative hidden sm:block w-64 lg:w-80">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id="search"
        type="text"
        placeholder="Search ByteChat"
        onKeyDown={(e) => {
          if (e.key === "Escape") e.currentTarget.blur()
        }}
        className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:bg-background transition-all placeholder:text-muted-foreground/80"
      />
    </div>
  )
}

/** Navigation link — uniform icon button, active gets accent tint */
function NavLink({
  href,
  icon: Icon,
  isActive,
  className: extraClass,
}: {
  href: string
  icon: typeof Home
  isActive: boolean
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative p-2 rounded-full transition-colors",
        isActive
          ? "text-accent bg-accent/15"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        extraClass
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
      className="sticky top-0 z-50 flex items-center gap-3 px-4 h-14 bg-background/80 backdrop-blur-xl">
      {/* Left — Logo + Search */}
      <div className="flex items-center gap-3 shrink-0">
        <BytechatLogo className="h-9 w-auto" />
      </div>

      <SearchBar />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Page navigation pill — routable links with active state, hidden on mobile */}
      <nav className="hidden sm:flex items-center gap-0.5 rounded-full bg-card/60 border border-border/40 px-1.5 py-1">
        <NavLink
          href={ROUTES.HOME}
          icon={Home}
          isActive={pathname === ROUTES.HOME}
        />
        <NavLink
          href={ROUTES.EXPLORE}
          icon={Compass}
          isActive={pathname === ROUTES.EXPLORE}
          className="hidden md:flex"
        />
        <NavLink
          href={ROUTES.LISTS}
          icon={List}
          isActive={pathname === ROUTES.LISTS}
          className="hidden md:flex"
        />
      </nav>

      {/* User dropdown — hidden on mobile where it lives in the bottom nav */}
      <div className="hidden sm:block">
        <UserMenu variant="header" />
      </div>
    </header>
  )
}
