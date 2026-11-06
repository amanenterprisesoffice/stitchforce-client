"use client"

import Link from "next/link"
import { ArrowUpRight, Package, ClipboardList, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import { Bundle } from "@/utils/zodSchema/bundle"
import { prettifyKey } from "@/utils/utils"

interface GarmentWorkersProps {
  workers: GarmentWorker[]
  isLoading?: boolean
}

interface BundlesProps {
  bundles: Bundle[]
  isLoading?: boolean
}

interface StyleQuickLinksProps {
  styleID: string
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function EmptyState({
  message,
  icon: Icon,
}: {
  message: string
  icon: React.ElementType
}) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/20 px-4 py-6 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

// Workers
export function StyleWorkers({ workers, isLoading }: GarmentWorkersProps) {
  return (
    <div className="h-full w-full space-y-3 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          Workers
          <Badge variant="secondary">
            {isLoading ? "..." : workers.length}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Workers who have worked on this style
        </p>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-3 rounded-xl border p-3"
              >
                <div className="size-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-2 w-16 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : workers.length === 0 ? (
          <EmptyState
            icon={Users}
            message="No workers have worked on this style yet."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {workers.map((worker) => (
              <Link
                key={worker.id}
                target="_blank"
                href={`/garment-workers/${worker.id}`}
                className="group flex min-w-0 items-center gap-3 rounded-xl border bg-card p-3 transition-all hover:border-primary/40 hover:bg-muted/40"
              >
                {worker.photo_url ? (
                  <img
                    src={worker.photo_url}
                    alt={`${worker.name} profile`}
                    className="size-10 shrink-0 rounded-full border object-cover"
                  />
                ) : (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {getInitials(worker.name || "Worker")}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium group-hover:text-primary">
                    {worker.name}
                  </p>

                  {worker.phone && (
                    <p className="truncate text-xs text-muted-foreground">
                      {worker.phone}
                    </p>
                  )}
                </div>

                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </div>
  )
}

// Bundles
export function StyleBundles({ bundles, isLoading }: BundlesProps) {
  return (
    <div className="h-full w-full space-y-3 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          Bundles
          <Badge variant="secondary">
            {isLoading ? "..." : bundles.length}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Bundles created for this style
        </p>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-3 rounded-xl border p-3"
              >
                <div className="size-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-2 w-16 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : bundles.length === 0 ? (
          <EmptyState
            icon={Package}
            message="No bundles have been created for this style yet."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bundles.map((bundle) => (
              <Link
                key={bundle.id}
                target="_blank"
                href={`/bundles/${bundle.id}`}
                className="group flex min-w-0 items-center gap-3 rounded-xl border bg-card p-3 transition-all hover:border-primary/40 hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold group-hover:text-primary">
                    {bundle.bundle_number}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {bundle.quantity} pieces
                  </p>
                </div>
                <Badge variant="outline" className="mt-1 text-xs">
                  {prettifyKey(bundle.status)}
                </Badge>

                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </div>
  )
}

// Quick links
export function StyleQuickLinks({ styleID }: StyleQuickLinksProps) {
  const links = [
    {
      title: "View all bundles",
      description: "See every bundle created for this style",
      href: `/bundles?style_id=${encodeURIComponent(styleID)}`,
      icon: Package,
    },
    {
      title: "View production entries",
      description: "See production records for this style",
      href: `/production-entries?style_id=${encodeURIComponent(styleID)}`,
      icon: ClipboardList,
    },
  ]

  return (
    <Card className="h-full shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Quick links</CardTitle>
        <p className="text-sm text-muted-foreground">
          Quickly navigate to related style records
        </p>
      </CardHeader>

      <CardContent className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => {
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:bg-muted/40"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary">
                    {link.title}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              </div>

              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
