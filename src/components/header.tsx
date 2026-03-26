"use client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Sun, Moon, LogOut, Search, Mail, Bell, ChevronDown, LayoutGrid, Compass, List } from "lucide-react"
import { cn, getInitials, getAvatarUrl } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BytechatLogo } from "./bytechat-logo"
import { ROUTES } from "@/config/constants"

/** Mock counts for demo purposes */
const MESSAGES_COUNT = 3
const NOTIFICATIONS_COUNT = 8
const TOTAL_BADGE = MESSAGES_COUNT + NOTIFICATIONS_COUNT

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
  const { data: session } = useSession()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = (resolvedTheme ?? theme) === "dark"

  return (
    <>
      <header
        data-testid="app-header"
        className="sticky top-0 z-50 flex items-center gap-3 px-4 h-14 bg-background/80 backdrop-blur-xl">
        {/* Left — Logo + Search */}
        <div className="flex items-center gap-3 shrink-0">
          <BytechatLogo className="h-9 w-auto" />
        </div>

        <SearchBar />

        {/* Mobile search icon — moved to mobile bottom nav */}

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

        {/* User dropdown — profile, messages, notifications, theme, logout */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative flex items-center gap-1.5 rounded-full bg-card/60 border border-border/40 pl-1 pr-2.5 py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 hover:bg-card/80 transition-colors"
              aria-label="User menu">
              <Avatar className="h-7 w-7 border border-border/50">
                <AvatarImage
                  src={session?.user?.image || getAvatarUrl(session?.user?.name || "user")}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback className="text-[10px] font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
                  {session?.user?.name
                    ? getInitials(session.user.name)
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:inline text-sm font-medium max-w-24 truncate">
                {session?.user?.name || "User"}
              </span>
              <ChevronDown size={12} className="text-muted-foreground" />
              {/* Total badge */}
              {TOTAL_BADGE > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4.5 min-w-4.5 px-1 text-[10px] font-bold bg-destructive text-white rounded-full flex items-center justify-center">
                  {TOTAL_BADGE}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem className="gap-2 justify-between">
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                Messages
              </span>
              {MESSAGES_COUNT > 0 && (
                <span className="h-5 min-w-5 px-1.5 text-[10px] font-bold bg-destructive text-white rounded-full flex items-center justify-center">
                  {MESSAGES_COUNT}
                </span>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem className="gap-2 justify-between">
              <span className="flex items-center gap-2">
                <Bell className="h-3.5 w-3.5" />
                Notifications
              </span>
              {NOTIFICATIONS_COUNT > 0 && (
                <span className="h-5 min-w-5 px-1.5 text-[10px] font-bold bg-destructive text-white rounded-full flex items-center justify-center">
                  {NOTIFICATIONS_COUNT}
                </span>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={ROUTES.PROFILE} className="gap-2">
                <User className="h-3.5 w-3.5" />
                My Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setTheme(isDark ? "light" : "dark")
              }}
              className="gap-2">
              {mounted ? (
                isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />
              ) : (
                <Sun className="h-3.5 w-3.5 opacity-0" />
              )}
              {mounted ? (isDark ? "Light Mode" : "Dark Mode") : "Toggle Theme"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => {
                e.preventDefault()
                setLogoutOpen(true)
              }}
              className="gap-2">
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogDescription />
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => signOut({ callbackUrl: ROUTES.LOGIN })}>
              Yes, log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
