import { NextRequest, NextResponse } from "next/server"
import { verifyToken, ClearAuthCookie, TOKEN_KEY } from "./utils/token"
import { isPublicRoute, isPublicOnlyRoute } from "./constants/routes"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Check if a raw cookie exists and verify it
  const rawToken = req.cookies.get(TOKEN_KEY)?.value
  const payload = rawToken ? await verifyToken(req) : null
  const isAuthenticated = Boolean(payload)
  const hasInvalidToken = Boolean(rawToken) && !isAuthenticated

  // Check if the route is public or public-only
  const isPublic = isPublicRoute(pathname)
  const isPublicOnly = isPublicOnlyRoute(pathname)

  // Redirect if logged-in users try to access login/register pages
  if (isAuthenticated && isPublicOnly) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Allow everyone to access truly public routes (and wipe bad token if present)
  if (isPublic) {
    const res = NextResponse.next()
    return hasInvalidToken ? ClearAuthCookie(res) : res
  }

  // Log the authentication status for debugging
  console.log(`Pathname: ${pathname}, Authenticated: ${isAuthenticated}`, {
    payload,
  })

  // Redirect unauthenticated users away from protected routes (and wipe bad token)
  if (!isAuthenticated && !isPublicOnly && !isPublic) {
    const res = NextResponse.redirect(new URL("/login", req.url))
    return hasInvalidToken ? ClearAuthCookie(res) : res
  }

  // Allow public-only routes for unauthenticated users (and wipe bad token if present)
  const res = NextResponse.next()
  return hasInvalidToken ? ClearAuthCookie(res) : res
}

export const config = {
  matcher: [
    "/((?!_next/.*|favicon\\.ico|manifest\\.json|robots\\.txt|service-worker\\.js|deploy/.*|.*\\.(?:png|svg|jpg|jpeg|gif|webp|ico|bmp|tiff|avif|webmanifest|json|woff|woff2|eot|ttf|otf)).*)",
  ],
}
