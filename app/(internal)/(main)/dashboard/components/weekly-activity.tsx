"use client"

import { CalendarDays, IndianRupee, Package } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { formatMoney } from "@/utils/utils"

import type { OrganizationDashboard } from "../schema"

interface Props {
  stats: OrganizationDashboard | null
  isLoading: boolean
}

export default function WeeklyActivity({
  stats,
  isLoading,
}: Props) {
  const weekly = stats?.this_week
  const daily = weekly?.daily ?? []

  const maxQuantity = Math.max(
    1,
    ...daily.map((day) => day.production_quantity)
  )

  const maxPayment = Math.max(
    1,
    ...daily.map((day) => day.payment_amount)
  )

  const formatDay = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      { weekday: "short" }
    )
  }

  const formatDate = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      { day: "numeric", month: "short" }
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg">
            This week's activity
          </CardTitle>
          <CardDescription className="mt-1">
            Production and worker payments across the week
          </CardDescription>
        </div>

        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <CalendarDays className="size-5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="size-4" />
              Production
            </div>

            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {isLoading
                ? "—"
                : (weekly?.production_quantity ?? 0).toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Pieces produced
            </p>
          </div>

          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IndianRupee className="size-4" />
              Payments
            </div>

            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {isLoading
                ? "—"
                : formatMoney(weekly?.payment_amount ?? 0)}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {weekly?.payment_count ?? 0} payments made
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium">Daily breakdown</p>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" />
                Production
              </span>

              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Payments
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-44 items-end gap-3">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-1 animate-pulse rounded-t-md bg-muted"
                  style={{ height: `${35 + index * 7}%` }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {daily.map((day) => {
                const quantityHeight =
                  day.production_quantity === 0
                    ? 2
                    : Math.max(
                        5,
                        (day.production_quantity / maxQuantity) * 100
                      )

                const paymentHeight =
                  day.payment_amount === 0
                    ? 2
                    : Math.max(
                        5,
                        (day.payment_amount / maxPayment) * 100
                      )

                return (
                  <div
                    key={day.date}
                    className="group flex min-w-0 flex-col items-center gap-2"
                    title={`${formatDate(day.date)}: ${day.production_quantity} pieces, ${formatMoney(day.payment_amount)}`}
                  >
                    <div className="flex h-36 w-full items-end justify-center gap-1 border-b pb-1">
                      <div
                        className="w-2/5 rounded-t-sm bg-primary transition-all group-hover:opacity-75"
                        style={{ height: `${quantityHeight}%` }}
                      />

                      <div
                        className="w-2/5 rounded-t-sm bg-emerald-500 transition-all group-hover:opacity-75"
                        style={{ height: `${paymentHeight}%` }}
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-xs font-medium">
                        {formatDay(day.date)}
                      </p>

                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {formatDate(day.date)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
          <div>
            <p className="text-muted-foreground">
              Production entries
            </p>
            <p className="mt-1 font-semibold tabular-nums">
              {weekly?.production_entries ?? 0}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Payment transactions
            </p>
            <p className="mt-1 font-semibold tabular-nums">
              {weekly?.payment_count ?? 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}