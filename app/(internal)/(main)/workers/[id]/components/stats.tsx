"use client"

import { Wallet, CheckCircle2, Clock } from "lucide-react"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"
import StateComponent from "@/components/StateComponent"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import type { WorkerPaymentSummary } from "@/utils/zodSchema/payments"
import { formatMoney } from "@/utils/utils"

interface Props {
  workerId: string
}

function WorkerStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="shadow-none">
          <CardContent className="flex flex-row items-center justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-3 w-48 max-w-full" />
            </div>

            <Skeleton className="size-11 shrink-0 rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function WorkerStats({ workerId }: Props) {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const url =
    organizationID && workerId
      ? `/api/organizations/${organizationID}/garment-workers/${workerId}/payment-summary`
      : ""

  const {
    data: summary,
    isLoading,
    error,
  } = useFetch<WorkerPaymentSummary>({
    url,
    auto: !!url,
  })

  if (isLoading) {
    return <WorkerStatsSkeleton />
  }

  if (error) {
    return (
      <StateComponent
        className="rounded-lg"
        message="Unable to load worker statistics"
        description="Something went wrong while fetching payment summary."
      />
    )
  }

  const stats = [
    {
      title: "Total Earned",
      value: summary?.total_earned ?? 0,
      description: "Total earnings from production entries",
      icon: Wallet,
    },
    {
      title: "Total Paid",
      value: summary?.total_paid ?? 0,
      description: "Total payments made to this worker",
      icon: CheckCircle2,
    },
    {
      title: "Pending Amount",
      value: summary?.total_pending ?? 0,
      description: "Remaining amount to be paid",
      icon: Clock,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.title} className="shadow-none">
            <CardContent className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <p className="text-3xl font-semibold tracking-tight tabular-nums">
                  {formatMoney(stat.value)}
                </p>

                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>

              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
