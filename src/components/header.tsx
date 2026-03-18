"use client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Sun, Moon, LogOut, Search, Mail, Bell, ChevronDown, LayoutGrid, Compass, List } from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
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
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/40 focus:bg-background transition-all placeholder:text-muted-foreground"
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

/** Icon button for nav items without routing */
function NavIconButton({
  icon: Icon,
  className: extraClass,
  badge,
  ariaLabel,
  onClick,
}: {
  icon: typeof Home
  className?: string
  badge?: string
  ariaLabel: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
        extraClass
      )}
      aria-label={ariaLabel}>
      <Icon size={18} strokeWidth={2} />
      {badge && (
        <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] font-bold bg-destructive text-white rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  )
}

/** Theme toggle button — defers render until mounted to avoid hydration mismatch */
function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = (resolvedTheme ?? theme) === "dark"

  const toggle = () => {
    document.documentElement.classList.add("transition-colors", "duration-500")
    setTheme(isDark ? "light" : "dark")
    setTimeout(() => {
      document.documentElement.classList.remove("transition-colors", "duration-500")
    }, 600)
  }

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      aria-label={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}>
      {mounted ? (
        isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />
      ) : (
        <Sun size={18} strokeWidth={2} className="opacity-0" />
      )}
    </button>
  )
}

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <>
      <header
        data-testid="app-header"
        className="sticky top-0 z-50 flex items-center gap-3 px-4 h-14 bg-background/80 backdrop-blur-xl border-b border-border/60">
        {/* Left — Logo + Search */}
        <div className="flex items-center gap-3 shrink-0">
          <BytechatLogo className="h-7 w-auto" />
        </div>

        <SearchBar />

        {/* Mobile search icon */}
        <button
          className="sm:hidden p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Search">
          <Search size={18} />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Page navigation pill — routable links with active state */}
        <nav className="flex items-center gap-0.5 rounded-full bg-card/60 border border-border/40 px-1.5 py-1">
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

        {/* Utility pill — action buttons, no active state */}
        <div className="flex items-center gap-0.5 rounded-full bg-card/60 border border-border/40 px-1.5 py-1">
          <ThemeToggle />
          <NavIconButton
            icon={Mail}
            ariaLabel="Messages"
            className="hidden lg:flex"
          />
          <NavIconButton
            icon={Bell}
            ariaLabel="Notifications"
            badge="8"
          />
        </div>

        {/* User pill — dropdown with profile link + logout */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1.5 rounded-full bg-card/60 border border-border/40 pl-1 pr-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-accent/50 hover:bg-card/80 transition-colors"
              aria-label="User menu">
              <Avatar className="h-7 w-7 border border-border/50">
                <AvatarImage
                  src={session?.user?.image || undefined}
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
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href={ROUTES.PROFILE} className="gap-2">
                <User className="h-3.5 w-3.5" />
                My Profile
              </Link>
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

        {/* Grid dots */}
        <button
          className="hidden lg:flex p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="More options">
          <LayoutGrid size={18} strokeWidth={2} />
        </button>
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
