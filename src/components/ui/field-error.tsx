import type { FieldError as RHFFieldError } from "react-hook-form"

interface FieldErrorProps {
  error?: RHFFieldError
  className?: string
}

export function FieldError({ error, className }: FieldErrorProps) {
  if (!error?.message) return null

  return (
    <p className={className ?? "text-destructive text-sm"}>{error.message}</p>
  )
}
