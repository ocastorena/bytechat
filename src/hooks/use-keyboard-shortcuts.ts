"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/config/constants"

export function useKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable

      if (isInput) return

      switch (e.key) {
        case "n":
          e.preventDefault()
          document.getElementById("post")?.focus()
          break
        case "/":
          e.preventDefault()
          document.getElementById("search")?.focus()
          break
        case "h":
          e.preventDefault()
          router.push(ROUTES.HOME)
          break
        case "p":
          e.preventDefault()
          router.push(ROUTES.PROFILE)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])
}
