"use client"
import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { BytechatLogo } from "./bytechat-logo"

function SearchBar() {
  return (
    <input
      type="text"
      placeholder="Search..."
      className="px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
    />
  )
}

export function Header() {
  const pathname = usePathname()
  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-50 grid grid-cols-[1fr_6fr_1fr] items-center justify-items-center p-6 bg-card border-b h-20">
      <div className="flex flex-row">
        <BytechatLogo className="px-2" />
        <SearchBar />
      </div>
      <div className="flex gap-4">
        <Link
          href="/home"
          className={
            "p-2 rounded hover:bg-muted" +
            (pathname === "/home" ? " text-accent" : "")
          }>
          <Home size={30} />
        </Link>
        <Link
          href="/profile"
          className={
            "p-2 rounded hover:bg-muted " +
            (pathname === "/profile" ? " text-accent" : "")
          }>
          <User size={30} />
        </Link>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Log out</Button>
        </AlertDialogTrigger>

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
