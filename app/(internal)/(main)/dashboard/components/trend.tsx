
"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, IndianRupee, Package } from "lucide-react"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import FormDatePicker from "@/components/ui/FormDatePicker"

import useFetch from "@/hooks/useFetch"

import { formatMoney, getLocalDateValue } from "@/utils/utils"

import type { OrganizationDashboard } from "../schema"

interface Props {
  organizationID: string
}

const groupOptions = [
  { value: "daily", label: "Daily", icon: CalendarDays },
  { value: "weekly", label: "Weekly", icon: CalendarDays },
  { value: "half_monthly", label: "Half-monthly", icon: CalendarDays },
  { value: "monthly", label: "Monthly", icon: CalendarDays },
  { value: "quarterly", label: "Quarterly", icon: CalendarDays },
]

const chartConfig = {
  production: {
    label: "Work completed",
    color: "var(--chart-1)",
  },
  payments: {
    label: "Payments made",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function DashboardTrend({ organizationID }: Props) {
  const today = getLocalDateValue()

  // DEFAULT DATE RANGE: LAST ONE YEAR
  const oneYearAgo = (() => {
    const date = new Date(`${today}T00:00:00`)
    date.setFullYear(date.getFullYear() - 1)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  })()

  const [fromDate, setFromDate] = useState(oneYearAgo)
  const [toDate, setToDate] = useState(today)
  const [groupBy, setGroupBy] = useState("half_monthly")

  const { data: trendData, isLoading, refetch: fetchTrend } = useFetch()

  // DATE RANGE

  const rangeDays = useMemo(() => {
    if (!fromDate || !toDate || fromDate > toDate) {
      return 0
    }

    const from = new Date(`${fromDate}T00:00:00`)
    const to = new Date(`${toDate}T00:00:00`)

    return (
      Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1
    )
  }, [fromDate, toDate])

  // AVAILABLE GROUPING OPTIONS

  const availableGroupOptions = useMemo(() => {
    if (rangeDays < 7) {
      return groupOptions.filter((option) => option.value === "daily")
    }

    if (rangeDays < 31) {
      return groupOptions.filter((option) =>
        ["daily", "weekly"].includes(option.value)
      )
    }

    if (rangeDays < 90) {
      return groupOptions.filter((option) =>
        ["daily", "weekly", "half_monthly"].includes(option.value)
      )
    }

    if (rangeDays < 180) {
      return groupOptions.filter((option) =>
        ["daily", "weekly", "half_monthly", "monthly"].includes(option.value)
      )
    }

    return groupOptions
  }, [rangeDays])

  // RESET INVALID GROUPING

  useEffect(() => {
    const isGroupAvailable = availableGroupOptions.some(
      (option) => option.value === groupBy
    )

    if (!isGroupAvailable) {
      setGroupBy("daily")
    }
  }, [availableGroupOptions, groupBy])

  // FETCH TREND

  useEffect(() => {
    if (!organizationID || !fromDate || !toDate || fromDate > toDate) {
      return
    }

    const params = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate,
      group_by: groupBy,
    })

    fetchTrend({
      url: `/api/organizations/${organizationID}/dashboard-trend?${params.toString()}`,
      method: "GET",
    })
  }, [organizationID, fromDate, toDate, groupBy, fetchTrend])

  // NORMALIZE RESPONSE

  const stats = (trendData?.data ?? trendData) as OrganizationDashboard | null

  const period = stats?.period
  const trend = stats?.trend
  const buckets = trend?.buckets ?? []

  const chartData = buckets.map((bucket) => ({
    label: bucket.label,
    from_date: bucket.from_date,
    to_date: bucket.to_date,
    production: bucket.production_amount,
    payments: bucket.payment_amount,
  }))

  // DATE FORMATTING

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    })

  const formatDateRange = (fromDate: string, toDate: string) => {
    if (fromDate === toDate) {
      return formatDate(fromDate)
    }

    return `${formatDate(fromDate)} – ${formatDate(toDate)}`
  }

  const groupLabels: Record<string, string> = {
    daily: "Daily",
    weekly: "Weekly",
    half_monthly: "Half-monthly",
    monthly: "Monthly",
    quarterly: "Quarterly",
  }

  const groupLabel = groupLabels[trend?.group_by ?? groupBy] ?? "Daily"

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg">Period activity</CardTitle>

          <CardDescription className="mt-1">
            Work completed and worker payments for the selected period
          </CardDescription>
        </div>

        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <CalendarDays className="size-5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* FILTERS */}

        <div className="space-y-4">
          {/* DATE RANGE */}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-2 gap-2 sm:w-auto">
              <FormDatePicker
                id="from_date"
                label="From"
                value={fromDate}
                onChange={(value: string) => {
                  setFromDate(value)

                  if (value > toDate) {
                    setToDate(value)
                  }
                }}
                disabled={isLoading}
              />

              <FormDatePicker
                id="to_date"
                label="To"
                value={toDate}
                onChange={(value: string) => {
                  setToDate(value)

                  if (value < fromDate) {
                    setFromDate(value)
                  }
                }}
                disabled={isLoading}
              />
            </div>

            {/* GROUPING */}

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                View breakdown
              </p>

              <div className="flex gap-1 overflow-x-auto rounded-lg bg-muted/50 p-1">
                {availableGroupOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setGroupBy(option.value)}
                    className={`shrink-0 rounded-md px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      groupBy === option.value
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PERIOD TOTALS */}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IndianRupee className="size-4" />
              Work completed
            </div>

            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {isLoading ? "—" : formatMoney(period?.production_amount ?? 0)}
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Package className="size-3" />
              {(period?.production_quantity ?? 0).toLocaleString("en-IN")}{" "}
              pieces produced
            </p>
          </div>

          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IndianRupee className="size-4" />
              Payments made
            </div>

            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {isLoading ? "—" : formatMoney(period?.payment_amount ?? 0)}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {period?.payment_count ?? 0} payments made
            </p>
          </div>
        </div>

        {/* CHART */}

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium">{groupLabel} breakdown</p>

            {trend?.from_date && trend?.to_date && (
              <p className="text-xs text-muted-foreground">
                {formatDateRange(trend.from_date, trend.to_date)}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex h-[260px] items-end gap-3">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-1 animate-pulse rounded-t-md bg-muted"
                  style={{
                    height: `${35 + index * 7}%`,
                  }}
                />
              ))}
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              No activity found for this period
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 12,
                  right: 8,
                  left: 8,
                  bottom: 0,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />

                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={65}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => {
                    if (value >= 100000) {
                      return `₹${(value / 100000).toFixed(1)}L`
                    }

                    if (value >= 1000) {
                      return `₹${(value / 1000).toFixed(0)}k`
                    }

                    return `₹${value}`
                  }}
                />

                <ChartTooltip
                  cursor={{
                    fill: "var(--muted)",
                    opacity: 0.35,
                  }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        const bucket = payload?.[0]?.payload

                        if (!bucket?.from_date || !bucket?.to_date) {
                          return bucket?.label ?? ""
                        }

                        return formatDateRange(
                          bucket.from_date,
                          bucket.to_date
                        )
                      }}
                      formatter={(value, name) => (
                        <div className="flex min-w-[130px] items-center justify-between gap-4">
                          <span className="text-muted-foreground">{name}</span>

                          <span className="font-mono font-medium tabular-nums">
                            {formatMoney(Number(value))}
                          </span>
                        </div>
                      )}
                    />
                  }
                />

                <Bar
                  dataKey="production"
                  fill="var(--color-production)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />

                <Bar
                  dataKey="payments"
                  fill="var(--color-payments)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ChartContainer>
          )}

          <div className="flex flex-wrap justify-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-[var(--chart-1)]" />
              Work completed
            </span>

            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-[var(--chart-2)]" />
              Payments made
            </span>
          </div>
        </div>

        {/* COUNTS */}

        <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
          <div>
            <p className="text-muted-foreground">Production entries</p>

            <p className="mt-1 font-semibold tabular-nums">
              {period?.production_entries ?? 0}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Payment transactions</p>

            <p className="mt-1 font-semibold tabular-nums">
              {period?.payment_count ?? 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
