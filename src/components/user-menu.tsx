"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { User, Sun, Moon, LogOut, Mail, Bell, ChevronDown } from "lucide-react"
import { getInitials, getAvatarUrl } from "@/lib/utils"
import { useState, useEffect, useCallback } from "react"
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
import { ROUTES } from "@/config/constants"

/** Mock counts for demo purposes */
const MESSAGES_COUNT = 3
const NOTIFICATIONS_COUNT = 8
const TOTAL_BADGE = MESSAGES_COUNT + NOTIFICATIONS_COUNT

/** Shared user dropdown menu used in header (desktop) and mobile nav */
export function UserMenu({ variant = "header" }: { variant?: "header" | "mobile" }) {
  const { data: session } = useSession()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = (resolvedTheme ?? theme) === "dark"

  /** Toggle theme with a smooth CSS transition */
  const toggleTheme = useCallback(() => {
    document.documentElement.classList.add("theme-transition")
    setTheme(isDark ? "light" : "dark")
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 400)
  }, [isDark, setTheme])

  const isMobile = variant === "mobile"

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isMobile ? (
            <button
              className="relative flex items-center justify-center py-3 px-4 transition-colors duration-150 text-muted-foreground"
              aria-label="User menu">
              <Avatar className="h-6 w-6 border border-border/50">
                <AvatarImage
                  src={session?.user?.image || getAvatarUrl(session?.user?.name || "user")}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback className="text-[8px] font-semibold bg-gradient-to-br from-accent/80 to-accent text-accent-foreground">
                  {session?.user?.name
                    ? getInitials(session.user.name)
                    : "U"}
                </AvatarFallback>
              </Avatar>
              {/* Total badge */}
              {TOTAL_BADGE > 0 && (
                <span className="absolute top-1.5 right-2 h-3.5 min-w-3.5 px-0.5 text-[8px] font-bold bg-destructive text-white rounded-full flex items-center justify-center">
                  {TOTAL_BADGE}
                </span>
              )}
            </button>
          ) : (
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
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isMobile ? "center" : "end"}
          side={isMobile ? "top" : "bottom"}
          className="w-52">
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
              toggleTheme()
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
