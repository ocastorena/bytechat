import { NextResponse } from "next/server"
import type { ZodError } from "zod"

/**
 * Standardized success response.
 * Shape: `{ ...data }` with the given status code.
 */
export function apiSuccess<T extends Record<string, unknown>>(
  data: T,
  status = 200
) {
  return NextResponse.json(data, { status })
}

/**
 * Standardized error response.
 * Shape: `{ error: string }` with the given status code.
 */
export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * Standardized Zod validation error response.
 * Shape: `{ error: string, fieldErrors: Record<string, string[]> }`
 *
 * `error` contains a joined summary of all messages.
 * `fieldErrors` maps each field name to its specific error messages.
 */
export function apiValidationError(zodError: ZodError) {
  const flat = zodError.flatten()
  const allMessages = [
    ...flat.formErrors,
    ...Object.values(flat.fieldErrors).flat(),
  ].filter(Boolean) as string[]

  return NextResponse.json(
    {
      error: allMessages.join(", ") || "Validation failed",
      fieldErrors: flat.fieldErrors,
    },
    { status: 400 }
  )
}

/**
 * Log an API error with a consistent context prefix.
 */
export function logApiError(context: string, error: unknown) {
  console.error(`[${context}]`, error)
}
