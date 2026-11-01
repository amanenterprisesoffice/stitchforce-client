
"use client"

import React from "react"
import { Separator } from "@/components/ui/separator"

interface PageHeaderProps {
  title: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  description?: string
  actions?: React.ReactNode
  showSeparator?: boolean
  className?: string
}

export default function PageHeader({
  title,
  icon,
  badge,
  description,
  actions,
  showSeparator = true,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
              {icon}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {title}
            </h1>

            {badge && (
              <div className="mt-1 flex items-center gap-2">
                {badge}
              </div>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {showSeparator && <Separator className="my-4" />}

      {description && (
        <p className="max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
