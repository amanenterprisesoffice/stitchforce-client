"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface QuickLinkItemProps {
  icon: ReactNode
  title: string
  description: string
  onClick: () => void
  className?: string
}

interface QuickLinksProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
}

export function QuickLinks({
  children,
  title = "Quick links",
  description = "Shortcuts to frequently used actions",
  className = "min-h-fit",
}: QuickLinksProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">{children}</div>
      </CardContent>
    </Card>
  )
}

export function QuickLinkItem({
  icon,
  title,
  description,
  onClick,
  className,
}: QuickLinkItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-start gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50",
        className
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:text-primary">
        {icon}
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </button>
  )
}
