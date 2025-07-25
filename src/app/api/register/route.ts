import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma" // your db connection utility
// import User from "@/models/User";      // your User mongoose/prisma model
import { z } from "zod" // for validation
import bcrypt from "bcryptjs" // for password hashing

// define zod schema

// POST handler
export async function POST(req: NextRequest) {
  try {
    // a) Parse JSON body
    // b) Validate with Zod schema
    // c) Check if user with this email already exists (return 409 if so)
    // d) Hash the password securely
    // e) Create/save new user in database
    // f) Return success response (201 status)
  } catch (error) {
    // g) Return 500 for unexpected errors, mask sensitive details
  }
}

// TODO: finish POST handler
