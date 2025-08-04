import { Header } from "@/components/header"
import { ReactNode } from "react"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header></Header>
      {children}
    </>
  )
}
