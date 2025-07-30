import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma" // your db connection utility
// import User from "@/models/User";      // your User mongoose/prisma model
import { z } from "zod" // for validation
import bcrypt from "bcryptjs" // for password hashing
import { registerSchema } from "./register-schema"

// POST handler
export async function POST(req: NextRequest) {
  try {
    // a) Parse JSON body
    // b) Validate with Zod schema
    const body = await req.json()
    const parseResult = registerSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parseResult.error).errors },
        { status: 400 }
      )
    }
    // c) Check if user with this email already exists (return 409 if so)
    const existingUser = await prisma.user.findUnique({
      where: { email: parseResult.data.email },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      )
    }
    // d) Hash the password securely
    const hashedPassword = await bcrypt.hash(parseResult.data.password, 10)
    // e) Create/save new user in database
    await prisma.user.create({
      data: {
        email: parseResult.data.email,
        password: hashedPassword,
        username: "",
      },
    })
    // f) Return success response (201 status)
    return NextResponse.json(
      { message: "User created successfully." },
      { status: 201 }
    )
  } catch (error) {
    // g) Return 500 for unexpected errors, mask sensitive details
    console.error("[REGISTER_ERROR]", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
