"use client"

import Link from "next/link"
import { ArrowUpRight, Package, ClipboardList, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { GarmentWorker } from "@/utils/types/garmentWorker"
import { Bundle } from "@/utils/types/bundle"
import { getInitials, prettifyKey } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WorkerInfo } from "@/components/ui/worker-avatar"

interface GarmentWorkersProps {
  workers: GarmentWorker[]
  isLoading?: boolean
}

interface BundlesProps {
  bundles: Bundle[]
  isLoading?: boolean
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
  const workerLimit = 4
  return (
    <div className="h-full w-full space-y-3 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          Recent Workers
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
        ) : workers.slice(0, workerLimit).length === 0 ? (
          <EmptyState
            icon={Users}
            message="No workers have worked on this style yet."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {workers.map((worker) => (
              <WorkerInfo
                worker={worker}
                key={worker.id}
                className="flex group items-center gap-3 rounded-xl border p-3 hover:bg-primary/10"
                linkClassName="w-full"
                linkMode="full"
                nameClassName="group-hover:text-primary"
              />
            ))}
          </div>
        )}
      </CardContent>
    </div>
  )
}

// Bundles
export function StyleBundles({ bundles, isLoading }: BundlesProps) {
  const bundleLimit = 4

  return (
    <div className="h-full w-full space-y-3 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          Recent Bundles
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
            {bundles.slice(0, bundleLimit).map((bundle) => (
              <Link
                key={bundle.id}
                target="_blank"
                href={`/bundles/${bundle.id}`}
                className="group flex min-w-0 items-center gap-3 rounded-xl border p-3 transition-all hover:bg-primary/10"
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
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </div>
  )
}
