"use client"

import { Scissors, CheckCircle2, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/DataTable"

import { formatDate, formatMoney } from "@/utils/utils"
import { PayableProductionEntry } from "@/utils/zodSchema/payments"

interface Props {
  entries: PayableProductionEntry[]
}

export default function PayableProductionEntriesTable({ entries }: Props) {
  const columns = [
    {
      header: "Production date",
      className: "whitespace-nowrap",
      render: (entry: PayableProductionEntry) =>
        formatDate(entry.production_date),
    },
    {
      header: "Bundle / Style",
      render: (entry: PayableProductionEntry) => (
        <div className="min-w-[150px]">
          <p className="font-medium">{entry.bundle?.bundle_number || "—"}</p>
          <p className="text-xs text-muted-foreground">
            {entry.style?.style_number ? `${entry.style.style_number} · ` : ""}
            {entry.style?.name || "Unknown style"}
          </p>
        </div>
      ),
    },
    {
      header: "Operation",
      render: (entry: PayableProductionEntry) => (
        <Badge variant="outline">
          <Scissors className="mr-1 size-3" />
          {entry.operation?.name || "Unknown operation"}
        </Badge>
      ),
    },
    // {
    //   header: "Qty",
    //   className: "text-right tabular-nums",
    //   render: (entry: PayableProductionEntry) =>
    //     Number(entry.quantity || 0).toLocaleString("en-IN"),
    // },
    // {
    //   header: "Rate / pc",
    //   className: "text-right whitespace-nowrap tabular-nums",
    //   render: (entry: PayableProductionEntry) =>
    //     formatMoney(entry.rate_per_piece),
    // },
    {
      header: "Payment",
      className: "text-right whitespace-nowrap",
      render: (entry: PayableProductionEntry) => {
        const total = Number(entry.total_amount || 0)
        const paid = Number(entry.paid_amount || 0)
        const pending = Number(entry.pending_amount || 0)

        if (paid >= total && total > 0) {
          return (
            <div className="text-right">
              <p className="font-medium tabular-nums">{formatMoney(total)}</p>
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
              <p className="font-medium tabular-nums">{formatMoney(total)}</p>
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
            <p className="font-semibold tabular-nums">{formatMoney(pending)}</p>
            <Badge variant="outline" className="mt-1 text-muted-foreground">
              <Clock className="mr-1 size-3" />
              Unpaid
            </Badge>
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      className="rounded-none"
      frameClassName="rounded-none!"
      tableContainerClassName="max-h-[400px]"
      data={entries}
      columns={columns}
      onRowClick={(entry) => {
        window.open(
          `/production-entries/${entry.production_entry_id}`,
          "_blank"
        )
      }}
      getRowId={(entry) => entry.production_entry_id}
      emptyMessage="No payable production entries found."
    />
  )
}
