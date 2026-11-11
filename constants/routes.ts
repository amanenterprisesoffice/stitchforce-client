const PUBLIC_ONLY_ROUTES = ["/login", "/register"]
const PUBLIC_ROUTES = ["/", "/verify-email"]

const isPublicRoute = (pathname: string) => PUBLIC_ROUTES.includes(pathname)
const isPublicOnlyRoute = (pathname: string) => PUBLIC_ONLY_ROUTES.includes(pathname)

export { PUBLIC_ONLY_ROUTES, PUBLIC_ROUTES, isPublicRoute, isPublicOnlyRoute }
