/**
 * Auth Token & Cookie Utilities (`utils/verifyToken.ts`)
 *
 * 1. REQUIRED ENVIRONMENT VARIABLES (`.env.local` & Vercel):
 *    - JWT_SECRET_KEY : Must match your Go backend's `JWT_SECRET` character-for-character.
 *    - JWT_ISSUER     : (Optional) Must match Go's `JWT_ISSUER` (e.g., "stitchforce-server").
 *                       Leave unset if your Go JWT generator doesn't stamp an `iss` claim.
 *
 * 2. COOKIE DOMAIN RULE (CRITICAL):
 *    - Your Go `AddCookie` sets a host-only cookie (`domain: ""`).
 *    - Because browser cookies are keyed by (Name, Domain, Path), `ClearAuthCookie` MUST
 *      also omit `domain` so the browser recognizes and deletes the exact same cookie.
 *    - Only re-add `domain` here if you later change Go `AddCookie` to set a parent domain
 *      (e.g., `Domain: ".yourdomain.com"`).
 *
 * 3. USAGE IN `proxy.ts` (MIDDLEWARE):
 *    - `verifyToken(req)` : Reads `access_token` from `req.cookies`, verifies its signature
 *                           and expiry using `jose`, and returns the decoded `JWTPayload`
 *                           (or `null` if missing/invalid/expired).
 *    - `ClearAuthCookie(res)` : Attaches a `Set-Cookie` header with `maxAge: 0` to any
 *                               `NextResponse` (redirect or `NextResponse.next()`) to wipe
 *                               tampered or expired cookies from the client browser.
 *
 * 4. EXAMPLE:
 *    const rawToken = req.cookies.get(TOKEN_KEY)?.value
 *    const payload = rawToken ? await verifyToken(req) : null
 *    if (rawToken && !payload) {
 *      return ClearAuthCookie(NextResponse.redirect(new URL("/login", req.url)))
 *    }
 */

import { NextRequest, NextResponse } from "next/server"
import { jwtVerify, JWTPayload } from "jose"

export const TOKEN_KEY = "access_token"

export const verifyToken = async (
  req: NextRequest
): Promise<JWTPayload | null> => {
  try {
    const token = req.cookies.get(TOKEN_KEY)?.value
    if (!token) return null

    const secret = process.env.JWT_SECRET_KEY
    if (!secret || secret.length === 0) {
      throw new Error("JWT_SECRET_KEY is missing or empty")
    }

    const key = new TextEncoder().encode(secret)
    const issuer = process.env.JWT_ISSUER

    const { payload } = await jwtVerify(token, key, {
      ...(issuer && { issuer }),
    })

    return payload
  } catch (err) {
    console.error("JWT verification failed:", {
      name: err instanceof Error ? err.name : "Unknown",
      message: err instanceof Error ? err.message : String(err),
      cause: err instanceof Error ? err.cause : undefined,
    })

    return null
  }
}

export function ClearAuthCookie(res: NextResponse): NextResponse {
  res.cookies.set(TOKEN_KEY, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return res
}
