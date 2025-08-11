"use client"
import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
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

export function Header() {
  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-50 flex justify-between items-center mb-4 p-6 bg-card border-b-1">
      <h1>Nav</h1>
      <h1 className="font-bold">Your Feed</h1>
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
