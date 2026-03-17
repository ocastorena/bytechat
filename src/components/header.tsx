"use client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Sun, Moon, LogOut, Search } from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
import { useState } from "react"
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
    <div className="relative hidden sm:block flex-1 max-w-lg">
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

/** Navigation icon link with active state */
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
        "relative p-2 rounded-lg transition-colors",
        isActive
          ? "text-accent bg-accent/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}>
      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      {isActive && (
        <span className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-5 h-0.5 bg-accent rounded-full" />
      )}
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <>
      <header
        data-testid="app-header"
        className="sticky top-0 z-50 flex items-center gap-4 px-4 h-14 bg-background/80 backdrop-blur-xl border-b border-border/60">
        {/* Left — Logo */}
        <div className="shrink-0">
          <BytechatLogo className="h-7 w-auto" />
        </div>

        {/* Center — Search */}
        <SearchBar />

        {/* Mobile search icon */}
        <button
          className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ml-auto"
          aria-label="Search">
          <Search size={20} />
        </button>

        {/* Right — Nav + Avatar */}
        <div className="flex items-center gap-1 sm:ml-auto">
          <NavLink
            href={ROUTES.HOME}
            icon={Home}
            isActive={pathname === ROUTES.HOME}
          />
          <NavLink
            href={ROUTES.PROFILE}
            icon={User}
            isActive={pathname === ROUTES.PROFILE}
          />

          <div className="w-px h-5 bg-border mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-full focus:outline-none focus:ring-1 focus:ring-accent/50"
                aria-label="User menu">
                <Avatar className="h-8 w-8 border border-border hover:border-accent/50 transition-colors">
                  <AvatarImage
                    src={session?.user?.image || undefined}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
                    {session?.user?.name
                      ? getInitials(session.user.name)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  const currentTheme = resolvedTheme ?? theme
                  document.documentElement.classList.add(
                    "transition-colors",
                    "duration-500"
                  )
                  setTheme(currentTheme === "light" ? "dark" : "light")
                  setTimeout(() => {
                    document.documentElement.classList.remove(
                      "transition-colors",
                      "duration-500"
                    )
                  }, 600)
                }}
                className="gap-2">
                {(resolvedTheme ?? theme) === "light" ? (
                  <>
                    <Moon className="h-3.5 w-3.5" /> Dark mode
                  </>
                ) : (
                  <>
                    <Sun className="h-3.5 w-3.5" /> Light mode
                  </>
                )}
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
        </div>
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
