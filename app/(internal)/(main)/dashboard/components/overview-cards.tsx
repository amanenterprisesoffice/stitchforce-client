
"use client"

import {
  Users,
  Scissors,
  Wallet,
  Clock3,
  TrendingUp,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import StateComponent from "@/components/StateComponent"

import { formatMoney } from "@/utils/utils"

import type { DashboardOverview } from "../schema"

interface Props {
  stats: DashboardOverview | null
  isLoading: boolean
  error?: string | null
}

export default function OverviewCards({
  stats,
  isLoading,
  error,
}: Props) {
  const overview = stats
  const today = overview?.today

  const cards = [
    {
      title: "Total workers",
      value: overview?.total_workers ?? 0,
      description: `${overview?.active_workers ?? 0} active workers`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total entries",
      value: overview?.total_production_entries ?? 0,
      description: `${overview?.total_styles ?? 0} styles`,
      icon: Scissors,
      color: "text-violet-600",
      bg: "bg-violet-500/10",
    },
    {
      title: "Total Work Completed",
      value: formatMoney(overview?.total_earned ?? 0),
      description: "Lifetime production earnings",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total paid",
      value: formatMoney(overview?.total_paid ?? 0),
      description: "Completed worker payments",
      icon: Wallet,
      color: "text-sky-600",
      bg: "bg-sky-500/10",
    },
    {
      title: "Pending payments",
      value: formatMoney(overview?.total_pending ?? 0),
      description: "Outstanding worker earnings",
      icon: Clock3,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
    {
      title: "Today's production",
      value: `${today?.production_quantity ?? 0} pcs`,
      description: `${today?.production_entries ?? 0} entries`,
      icon: Scissors,
      color: "text-violet-600",
      bg: "bg-violet-500/10",
    },
    {
      title: "Today's production amount",
      value: formatMoney(today?.production_amount ?? 0),
      description: "Production completed today",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Today's payments",
      value: formatMoney(today?.payment_amount ?? 0),
      description: `${today?.payment_count ?? 0} payments made today`,
      icon: Wallet,
      color: "text-sky-600",
      bg: "bg-sky-500/10",
    },
  ]

  if (error) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <StateComponent
            className="rounded-none"
            message={error || "Something went wrong"}
            description="An error occurred while loading dashboard overview."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((item) => {
        const Icon = item.icon

        return (
          <Card key={item.title} className="shadow-sm">
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-28" />

                      <div className="mt-2 flex min-h-8 items-center">
                        <Skeleton className="h-7 w-24" />
                      </div>

                      <Skeleton className="mt-3 h-3 w-32" />
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {item.title}
                      </p>

                      <div className="mt-1 min-h-8">
                        <p className="truncate text-2xl font-semibold tracking-tight">
                          {typeof item.value === "number"
                            ? item.value.toLocaleString("en-IN")
                            : item.value}
                        </p>
                      </div>

                      <p className="mt-2 truncate text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </>
                  )}
                </div>

                {isLoading ? (
                  <Skeleton className="size-11 shrink-0 rounded-xl" />
                ) : (
                  <div className={`shrink-0 rounded-xl p-3 ${item.bg}`}>
                    <Icon className={`size-5 ${item.color}`} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
