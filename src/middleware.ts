import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
    // Handle different cookie names for dev vs production
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  })

  console.log("Environment:", process.env.NODE_ENV)
  console.log("Token found:", !!token)

  if (!token) {
    console.log("No Token!")
    return NextResponse.redirect(new URL("/login", req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/home", "/home/:path*", "/profile", "/profile/:path*"], // protect these routes
}
