import { NextResponse, NextRequest } from "next/server";

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
    const pathname = url.pathname;
    
    // If it's root on custom domain, redirect or show root page
    if (pathname === "/" || pathname === "") {
      url.pathname = `/`;
      const res = NextResponse.rewrite(url);
      res.headers.set("x-door-custom-domain", hostname);
      return res;
    }

    // If it's a slug path e.g. /my-slug
    const slug = pathname.slice(1);
    if (slug && !slug.startsWith("_next") && !slug.startsWith("api")) {
      url.pathname = `/[slug]`;
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
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
