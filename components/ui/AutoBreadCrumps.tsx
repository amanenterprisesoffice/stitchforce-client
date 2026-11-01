"use client"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Scissors } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

// Regex to detect standard UUIDs (v1-v5)
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default function AutoBreadcrumbs() {
  const pathname = usePathname()

  const pathSegments = pathname.split("/").filter(Boolean) // Remove empty segments

  const crumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const isLast = index === pathSegments.length - 1

    // Detect if the segment is a UUID, otherwise format normally
    const label = UUID_REGEX.test(segment)
      ? "Details"
      : decodeURIComponent(segment)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())

    return (
      <React.Fragment key={href}>
        <BreadcrumbItem className="text-muted-text flex items-center">
          {isLast ? (
            <BreadcrumbPage className="text-text font-medium">
              {label}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink
              render={
                <Link
                  href={href}
                  className="transition-colors hover:text-primary"
                >
                  {label}
                </Link>
              }
            />
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator className="text-muted-text" />}
      </React.Fragment>
    )
  })

  return (
    <Breadcrumb className="text-sm">
      <BreadcrumbList className="flex items-center gap-1.5">
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/dashboard"
            className="text-muted-text flex items-center gap-1 transition-colors hover:text-primary"
          >
            <Scissors size={16.5} />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.length > 0 && (
          <BreadcrumbSeparator className="text-muted-text" />
        )}
        {crumbs}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
