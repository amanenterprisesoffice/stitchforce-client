import { NextResponse } from "next/server"
import { verifyToken } from "./utils/verifyToken"

import { isPublicRoute, isPublicOnlyRoute } from "./constants/routes"

export async function proxy(req) {
  const { pathname } = req.nextUrl

  // Verify token and get the payload
  const payload = await verifyToken(req)
  const isAuthenticated = Boolean(payload)

  // Check if the route is public or public-only
  const isPublic = isPublicRoute(pathname)
  const isPublicOnly = isPublicOnlyRoute(pathname)

  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Redirect if logged-in users try to access login/register pages
  if (isAuthenticated && isPublicOnly) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Allow everyone to access truly public routes (like '/')
  if (isPublic) {
    return NextResponse.next()
  }

  // log the authentication status for debugging
  console.log(`Pathname: ${pathname}, Authenticated: ${isAuthenticated}`, {
    payload,
  })

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && !isPublicOnly && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // For authenticated users, proceed to the next route
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/.*|favicon\\.ico|manifest\\.json|robots\\.txt|service-worker\\.js|deploy/.*|.*\\.(?:png|svg|jpg|jpeg|gif|webp|ico|bmp|tiff|avif|webmanifest|json|woff|woff2|eot|ttf|otf)).*)",
  ],
}
