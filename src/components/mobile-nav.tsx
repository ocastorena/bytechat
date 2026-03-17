"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/config/constants"

/** Tab item for the mobile bottom navigation */
function TabItem({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string
  icon: typeof Home
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-0.5 py-2 px-3 transition-colors",
        isActive
          ? "text-accent"
          : "text-muted-foreground"
      )}>
      <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}

/** Bottom tab bar for mobile — hidden on sm+ screens */
export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-background/80 backdrop-blur-xl">
      <div className="accent-line w-full" />
      <div className="flex items-center justify-around border-t border-border/40">
        <TabItem
          href={ROUTES.HOME}
          icon={Home}
          label="Home"
          isActive={pathname === ROUTES.HOME}
        />
        <TabItem
          href={ROUTES.HOME}
          icon={Search}
          label="Search"
          isActive={false}
        />
        <TabItem
          href={ROUTES.PROFILE}
          icon={User}
          label="Profile"
          isActive={pathname === ROUTES.PROFILE}
        />
      </div>
    </nav>
  )
}
