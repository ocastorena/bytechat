"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { z } from "zod"
import { registerSchema } from "@/lib/validations"
import { apiClient, ApiError } from "@/lib/api-client"
import { ROUTES } from "@/config/constants"

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await apiClient.auth.signup(values)
      router.push(ROUTES.LOGIN)
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
          if (messages && Array.isArray(messages)) {
            form.setError(field as keyof typeof values, {
              type: "server",
              message: String(messages[0]),
            })
          }
        })
      } else if (error instanceof Error) {
        form.setError("email", { type: "server", message: error.message })
      } else {
        form.setError("root", {
          type: "server",
          message: "Something went wrong. Please try again.",
        })
      }
    }
  }

  return (
    <main className={cn("flex flex-col gap-6", className)} {...props}>
      <BytechatLogo className="mx-auto mb-2" />
      <Card className="overflow-hidden">
        <div className="accent-line" />
        <CardHeader>
          <CardTitle className="text-lg">Create an account</CardTitle>
          <CardDescription>Enter your email below to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="focus-visible:ring-accent/30"
                  {...form.register("email")}
                />
                <FieldError error={form.formState.errors.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  required
                  className="focus-visible:ring-accent/30"
                  {...form.register("username")}
                />
                <FieldError error={form.formState.errors.username} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="focus-visible:ring-accent/30"
                  {...form.register("password")}
                />
                <FieldError error={form.formState.errors.password} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="focus-visible:ring-accent/30"
                  {...form.register("confirmPassword")}
                />
                <FieldError error={form.formState.errors.confirmPassword} />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing up..." : "Sign up"}
              </Button>
              {form.formState.errors.root && (
                <p className="text-destructive text-sm text-center">
                  {form.formState.errors.root.message}
                </p>
              )}
            </div>
            <div className="mt-4 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={ROUTES.LOGIN}
                className="text-accent hover:text-accent/80 transition-colors">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
