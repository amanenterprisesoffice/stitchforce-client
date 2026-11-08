"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import type { WorkerPayment } from "@/utils/zodSchema/payments"

import DataTable from "@/components/ui/DataTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { formatMoney, formatDate, getInitials } from "@/utils/utils"
import { getWorkerName } from "@/utils/zodSchema/garmentWorker"

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
        const worker = payment.worker
        const workerName = getWorkerName(worker)

        return (
          <div className="flex min-w-[180px] items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage
                src={worker?.photo_url || undefined}
                alt={workerName}
              />
              <AvatarFallback>{getInitials(workerName)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate font-medium">{workerName}</p>
              <p className="text-xs text-muted-foreground">
                {worker?.phone || "—"}
              </p>
            </div>
          </div>
        )
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
