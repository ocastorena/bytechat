import { redirect } from "next/navigation"
import SignupForm from "@/components/signup-form"
import { isDemoMode } from "@/lib/demo"
import { ROUTES } from "@/config/constants"

export default function Page() {
  if (isDemoMode) redirect(ROUTES.LOGIN)

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}
