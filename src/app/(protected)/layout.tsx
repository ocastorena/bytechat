import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { ReactNode } from "react"
import AuthSessionProvider from "@/components/session-provider"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthSessionProvider>
      <Header />
      <KeyboardShortcuts />
      <div className="pb-16 sm:pb-0">{children}</div>
      <MobileNav />
    </AuthSessionProvider>
  )
}
