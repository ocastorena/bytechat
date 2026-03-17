"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldError } from "@/components/ui/field-error"
import { BytechatLogo } from "@/components/bytechat-logo"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Suspense } from "react"
import { z } from "zod"
import { logInSchema } from "@/lib/validations"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { ROUTES } from "@/config/constants"

function LoginFormContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || ROUTES.HOME

  const form = useForm<z.infer<typeof logInSchema>>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof logInSchema>) {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: callbackUrl,
      redirect: true,
    })
  }

  return (
    <main className={cn("flex flex-col gap-6", className)} {...props}>
      <BytechatLogo className="mx-auto mb-2" />
      <Card className="overflow-hidden border-border/60">
        <div className="accent-line" />
        <CardHeader>
          <CardTitle className="text-lg">Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-muted/30 focus-visible:ring-accent/30 focus-visible:bg-background transition-colors"
                  {...form.register("email")}
                />
                <FieldError error={form.formState.errors.email} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-muted/30 focus-visible:ring-accent/30 focus-visible:bg-background transition-colors"
                  {...form.register("password")}
                />
                <FieldError error={form.formState.errors.password} />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href={ROUTES.SIGNUP}
                className="text-accent hover:text-accent/80 transition-colors font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export function LoginForm(props: React.ComponentProps<"div">) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent {...props} />
    </Suspense>
  )
}
