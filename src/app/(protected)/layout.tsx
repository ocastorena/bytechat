import { Header } from "@/components/header"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { ReactNode } from "react"
import AuthSessionProvider from "@/components/session-provider"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthSessionProvider>
      <Header />
      <KeyboardShortcuts />
      {children}
    </AuthSessionProvider>
  )
}
