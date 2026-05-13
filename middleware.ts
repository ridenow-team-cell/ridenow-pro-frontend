import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const TOKEN_COOKIE = "rn_token"

/** Routes that require authentication */
const PROTECTED_PREFIXES = ["/dashboard", "/operations"]

/** Auth pages — redirect away if already logged in */
const AUTH_PREFIX = "/login"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_COOKIE)?.value

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  /** Auth pages — redirect away if already logged in */
  const isAuthPage = pathname === "/" || pathname.startsWith(AUTH_PREFIX)

  // ── Not logged in → trying to reach a protected page ──────────────────
  if (isProtected && !token) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    // Preserve the intended destination so we can redirect back after login
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // ── Already logged in → trying to reach the login page ────────────────
  if (isAuthPage && token) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *  - _next/static  (static files)
     *  - _next/image   (image optimisation)
     *  - favicon.ico
     *  - /api/proxy/*  (our backend proxy — must always be reachable)
     *  - public assets (logo.png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/proxy|.*\\.(?:png|jpg|jpeg|svg|ico|webp)).*)",
  ],
}
