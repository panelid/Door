import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Skip middleware for static routes and API
  const { pathname } = request.nextUrl
  
  // Allow these paths through without middleware
  const publicPaths = ["/settings", "/api/", "/auth/", "/_next/", "/favicon.ico"]
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|settings|api|auth|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
