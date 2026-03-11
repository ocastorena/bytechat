import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { ROUTES } from "@/config/constants"

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

  if (!token) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/home", "/home/:path*", "/profile", "/profile/:path*"], // protect these routes
}
