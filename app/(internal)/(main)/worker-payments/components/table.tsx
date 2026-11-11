"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import type { WorkerPayment } from "@/utils/types/payments"

import DataTable from "@/components/ui/DataTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { formatMoney, formatDate, getInitials } from "@/utils/utils"
import { getWorkerName } from "@/utils/types/garmentWorker"
import { WorkerInfo } from "@/components/ui/worker-avatar"

interface Props {
  payments: WorkerPayment[]
  isLoading: boolean
}

export default function WorkerPaymentsTable({ payments, isLoading }: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Worker",
      render: (payment: WorkerPayment) => {
        return <WorkerInfo worker={payment.worker} />
      },
    },
    {
      header: "Payment date",
      className: "hidden sm:table-cell",
      render: (payment: WorkerPayment) => formatDate(payment.payment_date),
    },
    {
      header: "Method",
      render: (payment: WorkerPayment) => (
        <span className="capitalize">{payment.payment_method}</span>
      ),
    },
    {
      header: "Amount",
      render: (payment: WorkerPayment) => (
        <span className="font-medium tabular-nums">
          {formatMoney(payment.amount)}
        </span>
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
