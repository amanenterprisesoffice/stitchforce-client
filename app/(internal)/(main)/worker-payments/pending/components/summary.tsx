"use client"

import {
  Banknote,
  CircleDollarSign,
  Clock,
  Users,
  Wallet,
  AlertCircle,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatMoney } from "@/utils/utils"
import StateComponent from "@/components/StateComponent"

export interface WorkerPaymentSummaryData {
  total_earned: number
  total_paid: number
  total_pending: number
  pending_entries: number
  total_workers: number
}

interface Props {
  summary?: WorkerPaymentSummaryData | null
  isLoading: boolean
  error?: string | null
}

export default function WorkerPaymentSummary({
  summary,
  isLoading,
  error,
}: Props) {
  const cards = [
    {
      title: "Total earned",
      value: formatMoney(summary?.total_earned ?? 0),
      description: "Total value of completed work",
      icon: CircleDollarSign,
    },
    {
      title: "Total paid",
      value: formatMoney(summary?.total_paid ?? 0),
      description: "Payments already settled",
      icon: Banknote,
    },
    {
      title: "Total pending",
      value: formatMoney(summary?.total_pending ?? 0),
      description: "Outstanding worker payments",
      icon: Wallet,
    },
    {
      title: "Pending entries",
      value: (summary?.pending_entries ?? 0).toLocaleString("en-IN"),
      description: "Entries awaiting payment",
      icon: Clock,
    },
    {
      title: "Workers",
      value: (summary?.total_workers ?? 0).toLocaleString("en-IN"),
      description: "Workers with pending balances",
      icon: Users,
    },
  ]

  if (error && !isLoading) {
    return (
      <StateComponent
        className="rounded-none min-h-[200px] "
        ICON={<AlertCircle />}
        message={error || "Something went wrong"}
        description="An error occurred while loading the payment summary."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.title} className="shadow-none">
            <CardContent className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="mt-2 h-7 w-24" />
                    <Skeleton className="mt-2 h-3 w-32" />
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>

                    <p className="truncate text-2xl font-semibold tracking-tight tabular-nums">
                      {card.value}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </>
                )}
              </div>

              {isLoading ? (
                <Skeleton className="size-10 shrink-0 rounded-xl" />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
