import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function middleware(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/feed/:path*", "/profile/:path*"], // protect these routes
}
