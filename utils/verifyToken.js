const { jwtVerify } = require("jose")

const TokenKey = "access_token"

export const verifyToken = async (req) => {
  try {
    const token = req.cookies.get(TokenKey)?.value
    // log
    console.log(`Token: ${token}`)
    if (!token) return null

    const secret = process.env.JWT_SECRET_KEY

    if (!secret || secret.length === 0) {
      throw new Error("JWT_SECRET_KEY is missing or empty")
    }

    const key = new TextEncoder().encode(secret)

    const { payload } = await jwtVerify(
      token,
      key
    )
    //
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
