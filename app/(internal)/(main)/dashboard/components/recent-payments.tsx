"use client"

import { useRouter } from "next/navigation"
import { ArrowUpRight, Banknote, CreditCard } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/DataTable"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { formatDate, formatMoney, getInitials } from "@/utils/utils"

import type { DashboardPayment } from "../schema"
import { WorkerInfo } from "@/components/ui/worker-avatar"

interface Props {
  payments: DashboardPayment[] | null
  isLoading: boolean
}

export default function RecentPayments({ payments, isLoading }: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Worker",
      render: (payment: DashboardPayment) => {
        return <WorkerInfo worker={payment?.worker} ignoreFields={["phone"]} />
      },
    },
    {
      header: "Date",
      className: "whitespace-nowrap",
      render: (payment: DashboardPayment) => formatDate(payment.payment_date),
    },
    {
      header: "Method",
      render: (payment: DashboardPayment) => (
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
      render: (payment: DashboardPayment) => (
        <Badge
          variant={payment.status === "completed" ? "default" : "destructive"}
          className="capitalize"
        >
          {payment.status}
        </Badge>
      ),
    },
    {
      header: "Amount",
      className: "text-right whitespace-nowrap tabular-nums font-medium",
      render: (payment: DashboardPayment) => formatMoney(payment.amount),
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
      </CardContent>
    </Card>
  )
}
