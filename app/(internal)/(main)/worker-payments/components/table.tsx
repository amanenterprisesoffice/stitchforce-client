"use client"

import { useRouter } from "next/navigation"

import type { WorkerPayment } from "@/utils/types/payments"

import DataTable from "@/components/ui/DataTable"
import { Badge } from "@/components/ui/badge"
import { WorkerInfo } from "@/components/ui/worker-avatar"

import { formatMoney, formatDate } from "@/utils/utils"

interface Props {
  payments: WorkerPayment[]
  isLoading: boolean
}

export default function WorkerPaymentsTable({
  payments,
  isLoading,
}: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Worker",
      render: (payment: WorkerPayment) => (
        <WorkerInfo worker={payment.worker} />
      ),
    },
    {
      header: "Payment date",
      className: "hidden sm:table-cell",
      render: (payment: WorkerPayment) => (
        <span className="whitespace-nowrap">
          {formatDate(payment.payment_date)}
        </span>
      ),
    },
    {
      header: "Method",
      render: (payment: WorkerPayment) => (
        <span className="capitalize">
          {payment.payment_method.replaceAll("_", " ")}
        </span>
      ),
    },
    {
      header: "Reference",
      className: "hidden md:table-cell",
      render: (payment: WorkerPayment) => (
        <span className="text-sm text-muted-foreground">
          {payment.reference || "—"}
        </span>
      ),
    },
    {
      header: "Amount",
      render: (payment: WorkerPayment) => (
        <span className="font-semibold tabular-nums">
          {formatMoney(payment.amount)}
        </span>
      ),
    },
    {
      header: "Status",
      render: (payment: WorkerPayment) => (
        <Badge
          variant={
            payment.status === "completed"
              ? "default"
              : "secondary"
          }
          className="capitalize"
        >
          {payment.status.replaceAll("_", " ")}
        </Badge>
      ),
    },
  ]

  return (
    <DataTable
      data={payments}
      columns={columns}
      getRowId={(payment) => payment.id}
      onRowClick={(payment) => {
        router.push(`/worker-payments/${payment.id}`)
      }}
      emptyMessage="No worker payments found."
      isLoading={isLoading}
    />
  )
}