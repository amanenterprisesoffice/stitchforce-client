"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import DataTable from "@/components/ui/DataTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { formatMoney, getInitials } from "@/utils/utils"
import Pagination from "@/components/ui/pagination"
import { WorkerInfo } from "@/components/ui/worker-avatar"

export interface WorkerPaymentBalance {
  worker: {
    id: string
    name: string
    phone: string
    photo_url?: string
  }
  total_earned: number
  total_paid: number
  total_pending: number
  pending_entries: number
}

interface Props {
  balances: WorkerPaymentBalance[]
  isLoading: boolean
  limit: number
  offset: number
  totalItems: number
  hasNextPage: boolean
  setOffset: (offset: number) => void
  setLimit: (limit: number) => void
  filters: {
    styleID: string
    bundleID: string
    operationID: string
    fromDate: string
    toDate: string
  }
}

export default function WorkerPaymentsTable({
  balances,
  isLoading,
  limit,
  offset,
  totalItems,
  hasNextPage,
  setOffset,
  setLimit,
  filters,
}: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Worker",
      render: (balance: WorkerPaymentBalance) => {
        const worker = balance.worker

        return <WorkerInfo worker={worker} linkMode="name" />
      },
    },
    {
      header: "Total earned",
      render: (balance: WorkerPaymentBalance) => (
        <span className="tabular-nums">
          {formatMoney(balance.total_earned)}
        </span>
      ),
    },
    {
      header: "Total paid",
      render: (balance: WorkerPaymentBalance) => (
        <span className="tabular-nums">{formatMoney(balance.total_paid)}</span>
      ),
    },
    {
      header: "Pending amount",
      render: (balance: WorkerPaymentBalance) => (
        <span className="font-semibold tabular-nums">
          {formatMoney(balance.total_pending)}
        </span>
      ),
    },
    {
      header: "Pending entries",
      className: "hidden sm:table-cell",
      render: (balance: WorkerPaymentBalance) => (
        <Badge variant="secondary">{balance.pending_entries}</Badge>
      ),
    },
  ]

  return (
    <>
      <DataTable
        data={balances}
        columns={columns}
        getRowId={(balance) => balance.worker.id}
        onRowClick={(balance) => {
          const params = new URLSearchParams({
            worker_id: balance.worker.id,
            status: "payable",
          })

          if (filters.styleID) params.set("style_id", filters.styleID)
          if (filters.bundleID) params.set("bundle_id", filters.bundleID)
          if (filters.operationID)
            params.set("style_operation_id", filters.operationID)
          if (filters.fromDate) params.set("from_date", filters.fromDate)
          if (filters.toDate) params.set("to_date", filters.toDate)

            // open in new page
            window.open(`/production-entries?${params.toString()}`, "_blank")
          // router.push(`/production-entries?${params.toString()}`)
        }}
        emptyMessage="No pending worker payments found."
        isLoading={isLoading}
      />

      <Pagination
        limit={limit}
        offset={offset}
        itemCount={totalItems}
        totalItems={totalItems}
        hasNextPage={hasNextPage}
        onPageChange={setOffset}
        onLimitChange={(nextLimit) => {
          setLimit(nextLimit)
          setOffset(0)
        }}
      />
    </>
  )
}
