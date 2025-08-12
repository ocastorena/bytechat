import { Header } from "@/components/header"
import { ReactNode } from "react"
import AuthSessionProvider from "@/components/session-provider"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header></Header>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </>
  )
}
