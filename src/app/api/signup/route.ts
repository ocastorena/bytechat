import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { saltAndHashPassword } from "@/lib/password"
import { registerSchema } from "@/lib/validations"
import {
  apiSuccess,
  apiError,
  apiValidationError,
  logApiError,
} from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parseResult = registerSchema.safeParse(body)

    if (!parseResult.success) {
      return apiValidationError(parseResult.error)
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parseResult.data.email },
    })
    if (existingUser) {
      return apiError("An account with this email already exists.", 409)
    }

    const hashedPassword = await saltAndHashPassword(parseResult.data.password)

    await prisma.user.create({
      data: {
        email: parseResult.data.email,
        username: parseResult.data.username,
        password: hashedPassword,
      },
    })

    return apiSuccess({ message: "User created successfully." }, 201)
  } catch (error) {
    logApiError("REGISTER", error)
    return apiError("An unexpected error occurred. Please try again later.", 500)
  }
}
