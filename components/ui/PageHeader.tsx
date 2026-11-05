"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
  badge?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  backlink?: string
}

export default function PageHeader({
  title,
  description,
  badge,
  icon,
  action,
  backlink,
}: PageHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        {backlink && (
          <Button 
            variant="ghost"
            size="sm"
            className="-ml-2"
            render={<Link href={backlink} />}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <Button size="lg" variant="outline" className="aspect-square h-full">
              {icon}
            </Button>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold tracking-tight">
                {title}
              </h2>

              {badge}
            </div>

            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        {action && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {action}
          </div>
        )}
      </div>
    </>
  )
}
