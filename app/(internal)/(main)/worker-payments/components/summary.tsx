
"use client"

import {
  AlertCircle,
  CreditCard,
  IndianRupee,
  Receipt,
  Wallet,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatMoney } from "@/utils/utils"
import StateComponent from "@/components/StateComponent"

export interface WorkerPaymentsSummaryData {
  total_payments: number
  total_amount: number
  completed_payments: number
  completed_amount: number
}

interface Props {
  summary: WorkerPaymentsSummaryData
  isLoading: boolean
  error?: string | null
}

export default function WorkerPaymentsSummary({
  summary,
  isLoading,
  error,
}: Props) {
  const cards = [
    {
      title: "Total payments",
      value: summary.total_payments.toLocaleString("en-IN"),
      description: "Payment records",
      icon: Receipt,
    },
    {
      title: "Total amount",
      value: formatMoney(summary.total_amount),
      description: "Amount recorded",
      icon: IndianRupee,
    },
    {
      title: "Completed payments",
      value: summary.completed_payments.toLocaleString("en-IN"),
      description: "Successfully completed",
      icon: CreditCard,
    },
    {
      title: "Completed amount",
      value: formatMoney(summary.completed_amount),
      description: "Amount successfully paid",
      icon: Wallet,
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
