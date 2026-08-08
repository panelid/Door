import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Middleware to handle custom domain routing
export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  
  // Exclude Vercel preview domains, localhost, and main domain
  const isCustomDomain = 
    hostname &&
    !hostname.includes("vercel.app") &&
    !hostname.includes("localhost") &&
    !hostname.endsWith("door.id");

  if (isCustomDomain) {
    // Rewrite custom domain requests to handle slugs or root
    // e.g. customdomain.com/my-slug -> /custom-domain-handler?domain=customdomain.com&slug=my-slug
    const pathname = url.pathname;
    
    // If it's root, we can show user's profile or default landing
    if (pathname === "/" || pathname === "") {
      url.pathname = `/domain-root`;
      url.searchParams.set("domain", hostname);
      return NextResponse.rewrite(url);
    }

    // If it's a slug path e.g. /my-slug
    const slug = pathname.slice(1);
    if (slug && !slug.startsWith("_next") && !slug.startsWith("api")) {
      url.pathname = `/[slug]`;
      // We can pass the custom domain info via headers or query
      const res = NextResponse.rewrite(url);
      res.headers.set("x-door-custom-domain", hostname);
      return res;
    }
  }

  // Standard middleware behavior for door.id
  const { pathname } = url;
  const publicPaths = ["/settings", "/api/", "/auth/", "/_next/", "/favicon.ico"];
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
