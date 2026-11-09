"use client"

import { Scissors, CheckCircle2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/DataTable"
import Pagination from "@/components/ui/pagination"

import { formatDate, formatMoney } from "@/utils/utils"
import type { ProductionEntry } from "@/utils/zodSchema/production-entry"
interface Props {
  entries: ProductionEntry[]
  limit: number
  offset: number
  totalItems?: number
  hasNextPage: boolean
  onPageChange: (offset: number) => void
  onLimitChange: (limit: number) => void
}

export default function PayableProductionEntriesTable({
  entries,
  limit,
  offset,
  totalItems,
  hasNextPage,
  onPageChange,
  onLimitChange,
}: Props) {
  const columns = [
    {
      header: "Production date",
      className: "whitespace-nowrap",
      render: (entry: ProductionEntry) =>
        formatDate(entry.production_date),
    },
    {
      header: "Bundle / Style",
      render: (entry: ProductionEntry) => (
        <div className="min-w-[150px]">
          <p className="font-medium">
            {entry.bundle?.bundle_number || "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            {entry.style?.style_number
              ? `${entry.style.style_number} · `
              : ""}
            {entry.style?.name || "Unknown style"}
          </p>
        </div>
      ),
    },
    {
      header: "Operation",
      render: (entry: ProductionEntry) => (
        <Badge variant="outline">
          <Scissors className="mr-1 size-3" />
          {entry.operation?.name || "Unknown operation"}
        </Badge>
      ),
    },
    {
      header: "Payment",
      className: "text-right whitespace-nowrap",
      render: (entry: ProductionEntry) => {
        const total = Number(entry.total_amount || 0)
        const paid = Number(entry.paid_amount || 0)
        const pending = Number(entry.pending_amount || 0)

        if (paid >= total && total > 0) {
          return (
            <div className="text-right">
              <p className="font-medium tabular-nums">
                {formatMoney(total)}
              </p>

              <Badge variant="secondary" className="mt-1">
                <CheckCircle2 className="mr-1 size-3" />
                Paid
              </Badge>
            </div>
          )
        }

        if (paid > 0) {
          return (
            <div className="min-w-[130px] space-y-1 text-right">
              <p className="font-medium tabular-nums">
                {formatMoney(total)}
              </p>

              <p className="text-xs text-green-600 tabular-nums">
                Paid: {formatMoney(paid)}
              </p>

              <p className="text-xs font-semibold text-destructive tabular-nums">
                Due: {formatMoney(pending)}
              </p>
            </div>
          )
        }

        return (
          <div className="text-right">
            <p className="font-semibold tabular-nums">
              {formatMoney(pending)}
            </p>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex min-w-0 flex-col">
      <DataTable
        className="rounded-none"
        frameClassName="rounded-none!"
        tableContainerClassName="max-h-[400px]"
        data={entries}
        columns={columns}
        onRowClick={(entry) => {
          window.open(
            `/production-entries/${entry.id}`,
            "_blank"
          )
        }}
        getRowId={(entry) => entry.id}
        emptyMessage="No payable production entries found."
      />

      <div className="border-t p-3">
        <Pagination
          limit={limit}
          offset={offset}
          itemCount={entries.length}
          totalItems={totalItems}
          hasNextPage={hasNextPage}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </div>
    </div>
  )
}