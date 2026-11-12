"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useOrganization } from "@/contexts/OrganizationContext"
import Loader from "@/components/ui/Loader"
import { hasValidLicense } from "@/utils/types/organization"
import { isPublicOnlyRoute, isPublicRoute } from "@/constants/routes"

const LICENSE_ROUTE = "/organization/license"

const ALLOWED_ROUTES = [LICENSE_ROUTE, "/profile", "/organization"]

export default function LicenseGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const isPublic = isPublicRoute(pathname) || isPublicOnlyRoute(pathname)

  const isAllowedRoute = ALLOWED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  const { organization, isLoading } = useOrganization()

  const isLicenseValid = hasValidLicense(organization)

  useEffect(() => {
    if (isPublic || isAllowedRoute || isLoading || !organization) return

    if (!isLicenseValid) {
      router.replace(LICENSE_ROUTE)
    }
  }, [
    isPublic,
    isAllowedRoute,
    isLoading,
    organization,
    isLicenseValid,
    router,
  ])

  // Login, register and other public routes must render immediately.
  if (isPublic) return children

  // License and other explicitly allowed routes don't need a valid license.
  if (isAllowedRoute) {
    return isLoading ? <Loader fullScreen /> : children
  }

  if (isLoading || !organization) {
    return <Loader fullScreen />
  }

  if (!isLicenseValid) {
    return <Loader fullScreen />
  }

  return children
}
