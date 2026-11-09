"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import type { DashboardOverview } from "../schema"

interface Props {
  stats: DashboardOverview | null
  isLoading: boolean
}

const statuses = [
  {
    key: "created",
    label: "Created",
    color: "bg-slate-400",
  },
  {
    key: "ready",
    label: "Ready",
    color: "bg-blue-500",
  },
  {
    key: "in_progress",
    label: "In progress",
    color: "bg-amber-500",
  },
  {
    key: "completed",
    label: "Completed",
    color: "bg-emerald-500",
  },
] as const

export default function BundleStatus({ stats, isLoading }: Props) {
  const bundleStatus = stats?.bundle_status

  const total = statuses.reduce(
    (sum, item) => sum + (bundleStatus?.[item.key] ?? 0),
    0
  )

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Bundle overview</CardTitle>
        <CardDescription>Current distribution of your bundles</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <p className="text-3xl font-semibold tabular-nums">
            {isLoading ? "—" : total.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted-foreground">Total bundles</p>
        </div>

        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
          {statuses.map((item) => {
            const count = bundleStatus?.[item.key] ?? 0

            return (
              <div
                key={item.key}
                className={`${item.color} transition-all`}
                style={{
                  width: total > 0 ? `${(count / total) * 100}%` : "0%",
                }}
              />
            )
          })}
        </div>

        <div className="space-y-3">
          {statuses.map((item) => {
            const count = bundleStatus?.[item.key] ?? 0

            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>

                <Badge variant="secondary" className="tabular-nums">
                  {isLoading ? "—" : count.toLocaleString("en-IN")}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
