"use client"

import { useRouter } from "next/navigation"
import { ArrowUpRight, Banknote, CreditCard } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/DataTable"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  formatDate,
  formatMoney,
  getInitials,
} from "@/utils/utils"

import type { DashboardPayment } from "../schema"

interface Props {
  payments: DashboardPayment[]
  isLoading: boolean
}

export default function RecentPayments({
  payments,
  isLoading,
}: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Worker",
      render: (payment: DashboardPayment) => {
        const name = payment.worker?.name || "Unknown worker"

        return (
          <div className="flex min-w-[150px] items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarImage
                src={payment.worker?.photo_url || undefined}
                alt={name}
              />
              <AvatarFallback>
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">
                {payment.worker?.phone || "—"}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      header: "Date",
      className: "whitespace-nowrap",
      render: (payment: DashboardPayment) =>
        formatDate(payment.payment_date),
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
          variant={
            payment.status === "completed"
              ? "default"
              : "destructive"
          }
          className="capitalize"
        >
          {payment.status}
        </Badge>
      ),
    },
    {
      header: "Amount",
      className: "text-right whitespace-nowrap tabular-nums font-medium",
      render: (payment: DashboardPayment) =>
        formatMoney(payment.amount),
    },
  ]

  return (
    <Card className="shadow-sm pb-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-lg">
          Recent payments
        </CardTitle>

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
          data={payments}
          columns={columns}
          getRowId={(payment) => payment.id}
          onRowClick={(payment) =>
            router.push(`/worker-payments/${payment.id}`)
          }
          emptyMessage="No payments made yet."
          isLoading={isLoading}
          className="rounded-none"
        />
      </CardContent>
    </Card>
  )
}