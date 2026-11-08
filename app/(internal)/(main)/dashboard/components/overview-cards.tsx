"use client"

import {
  Users,
  Scissors,
  IndianRupee,
  Wallet,
  Clock3,
  TrendingUp,
} from "lucide-react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { formatMoney } from "@/utils/utils"

import type { OrganizationDashboard } from "../schema"

interface Props {
  stats: OrganizationDashboard | null
  isLoading: boolean
}

export default function OverviewCards({
  stats,
  isLoading,
}: Props) {
  const overview = stats?.overview

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
      title: "Production entries",
      value: overview?.total_production_entries ?? 0,
      description: `${stats?.today.production_quantity ?? 0} pieces today`,
      icon: Scissors,
      color: "text-violet-600",
      bg: "bg-violet-500/10",
    },
    {
      title: "Total earned",
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
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((item) => {
        const Icon = item.icon

        return (
          <Card key={item.title} className="shadow-sm">
            <CardContent className="">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">
                    {item.title}
                  </p>

                  <div className="mt-1 min-h-8">
                    {isLoading ? (
                      <div className="h-7 w-24 animate-pulse rounded bg-muted" />
                    ) : (
                      <p className="truncate text-2xl font-semibold tracking-tight">
                        {item.value.toLocaleString?.("en-IN") ?? item.value}
                      </p>
                    )}
                  </div>

                  <p className="mt-2 truncate text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${item.bg}`}>
                  <Icon className={`size-5 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}