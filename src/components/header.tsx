"use client"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Sun, Moon } from "lucide-react"
import { Menu } from "lucide-react"
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
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { BytechatLogo } from "./bytechat-logo"

function SearchBar() {
  return (
    <div className="relative hidden sm:block">
      <input
        id="search"
        type="text"
        placeholder="Search..."
        onKeyDown={(e) => {
          if (e.key === "Escape") e.currentTarget.blur()
        }}
        className="px-4 py-1.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-44 md:w-64 max-w-full"
      />
      <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono">
        /
      </kbd>
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2 bg-card border-b h-14 w-full">
      <div className="flex items-center gap-2 justify-self-start shrink-0">
        <BytechatLogo className="px-2" />
        <SearchBar />
      </div>
      <div className="flex gap-4 justify-self-center w-fit">
        <Link
          href="/home"
          className={
            "p-2 rounded hover:bg-muted" +
            (pathname === "/home" ? " text-accent" : "")
          }>
          <Home size={22} />
        </Link>
        <Link
          href="/profile"
          className={
            "p-2 rounded hover:bg-muted " +
            (pathname === "/profile" ? " text-accent" : "")
          }>
          <User size={22} />
        </Link>
      </div>
      <div className="justify-self-end shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-2 rounded hover:bg-muted"
              aria-label="Open menu">
              <Menu size={22} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
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
                  <Moon className="h-4 w-4" /> Dark Mode
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" /> Light Mode
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => {
                e.preventDefault() // keep the dropdown open so the dialog can open
                setLogoutOpen(true)
              }}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
              onClick={() => signOut({ callbackUrl: "/login" })}>
              Yes, log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}
