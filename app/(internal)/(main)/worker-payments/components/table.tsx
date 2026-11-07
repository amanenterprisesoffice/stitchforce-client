"use client"

import Link from "next/link"
import { Eye, Ban, UserRound } from "lucide-react"

import type { WorkerPayment } from "@/utils/zodSchema/payments"
import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import DataTable from "@/components/ui/DataTable"

import { formatMoney, formatDate, getInitials } from "@/utils/utils"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  payments: WorkerPayment[]
  workers: GarmentWorker[] | null
  onVoid: (payment: WorkerPayment) => void
  isLoading: boolean
}

export default function WorkerPaymentsTable({
  payments,
  workers,
  onVoid,
  isLoading,
}: Props) {
  const workerMap = new Map((workers ?? []).map((worker) => [worker.id, worker]))

  const columns = [
    {
      header: "Worker",
      render: (payment: WorkerPayment) => {
        const worker = payment.worker ?? workerMap.get(payment.worker_id)

        return (
          <Link
            href={`/workers/${payment.worker_id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 font-medium hover:text-primary"
          >
            <Avatar>
              <AvatarImage src={worker?.photo_url} alt={worker?.name || "Worker"} />
              <AvatarFallback>{getInitials(worker?.name || "Worker")}</AvatarFallback>
            </Avatar>

            <span>{worker?.name || "Worker"}</span>
          </Link>
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
    // {
    //   header: "Reference",
    //   className: "hidden md:table-cell text-muted-foreground",
    //   render: (payment: WorkerPayment) =>
    //     payment.reference || "—",
    // },
    {
      header: "Amount",
      render: (payment: WorkerPayment) => (
        <span className="font-medium tabular-nums">
          {formatMoney(payment.amount)}
        </span>
      ),
    },
    // {
    //   header: "Status",
    //   render: (payment: WorkerPayment) => (
    //     <Badge
    //       variant={
    //         payment.status === "completed" ? "default" : "secondary"
    //       }
    //       className="capitalize"
    //     >
    //       {payment.status}
    //     </Badge>
    //   ),
    // },
    // {
    //   header: "",
    //   className: "w-[100px]",
    //   render: (payment: WorkerPayment) => (
    //     <div
    //       className="flex justify-end gap-1"
    //       onClick={(e) => e.stopPropagation()}
    //     >
    //       <Button
    //         render={
    //           <Link
    //             href={`/worker-payments/${payment.id}`}
    //             aria-label="View payment"
    //           />
    //         }
    //         variant="ghost"
    //         size="icon"
    //       >
    //         <Eye className="size-4" />
    //       </Button>

    //       {payment.status === "completed" && (
    //         <Button
    //           variant="ghost"
    //           size="icon"
    //           onClick={() => onVoid(payment)}
    //           aria-label="Void payment"
    //         >
    //           <Ban className="size-4 text-destructive" />
    //         </Button>
    //       )}
    //     </div>
    //   ),
    // },
  ]

  const router = useRouter()

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
