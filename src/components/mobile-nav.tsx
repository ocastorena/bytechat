"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Search, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserMenu } from "./user-menu"
import { ROUTES } from "@/config/constants"

/** Tab icon for the mobile bottom navigation */
function TabItem({
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
        "flex items-center justify-center py-3 px-4 transition-colors duration-150",
        isActive
          ? "text-accent"
          : "text-muted-foreground"
      )}>
      <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
    </Link>
  )
}

/** Bottom tab bar for mobile — icons only, hidden on sm+ screens */
export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-background/80 backdrop-blur-xl border-t border-border/60">
      <div className="flex items-center justify-around">
        <TabItem
          href={ROUTES.HOME}
          icon={Home}
          isActive={pathname === ROUTES.HOME}
        />
        <TabItem
          href={ROUTES.EXPLORE}
          icon={Compass}
          isActive={pathname === ROUTES.EXPLORE}
        />
        {/* Profile menu — center position */}
        <UserMenu variant="mobile" />
        <TabItem
          href={ROUTES.LISTS}
          icon={List}
          isActive={pathname === ROUTES.LISTS}
        />
        <TabItem
          href={ROUTES.SEARCH}
          icon={Search}
          isActive={pathname === ROUTES.SEARCH}
        />
      </div>
    </nav>
  )
}
