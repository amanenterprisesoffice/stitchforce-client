
"use client"

import { useRouter } from "next/navigation"
import { ArrowUpRight, Banknote, CreditCard } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/DataTable"
import StateComponent from "@/components/StateComponent"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { formatDate, formatMoney } from "@/utils/utils"

import { WorkerInfo } from "@/components/ui/worker-avatar"
import { WorkerPayment } from "@/utils/types/payments"

interface Props {
  payments: WorkerPayment[] | null
  isLoading: boolean
  error?: string | null
}

export default function RecentPayments({
  payments,
  isLoading,
  error,
}: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Worker",
      render: (payment: WorkerPayment) => {
        return <WorkerInfo worker={payment?.worker} />
      },
    },
    {
      header: "Date",
      className: "whitespace-nowrap",
      render: (payment: WorkerPayment) =>
        formatDate(payment.payment_date),
    },
    {
      header: "Method",
      render: (payment: WorkerPayment) => (
        <Badge variant="outline" className="capitalize">
          {payment.payment_method === "upi" ? (
            <CreditCard className="mr-1 size-3" />
          ) : (
            <Banknote className="mr-1 size-3" />
          )}
          {payment.payment_method}
        </Badge>
      ),
    },
    {
      header: "Status",
      render: (payment: WorkerPayment) => (
        <Badge
          variant={
            payment.status === "completed" ? "default" : "destructive"
          }
          className="capitalize"
        >
          {payment.status}
        </Badge>
      ),
    },
    {
      header: "Amount",
      className: "whitespace-nowrap text-right font-medium tabular-nums",
      render: (payment: WorkerPayment) =>
        formatMoney(payment.amount),
    },
  ]

  return (
    <Card className="pb-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-lg">Recent payments</CardTitle>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => router.push("/worker-payments")}
        >
          View all
          <ArrowUpRight className="ml-1 size-4" />
        </Button>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        {error ? (
          <div className="px-4 pb-4">
            <StateComponent
              className="rounded-none"
              message={error || "Something went wrong"}
              description="An error occurred while loading recent payments."
            />
          </div>
        ) : (
          <DataTable
            data={payments ?? []}
            columns={columns}
            getRowId={(payment) => payment?.id ?? ""}
            onRowClick={(payment) =>
              router.push(`/worker-payments/${payment?.id}`)
            }
            emptyMessage="No payments found."
            isLoading={isLoading}
            className="rounded-none"
          />
        )}
      </CardContent>
    </Card>
  )
}
