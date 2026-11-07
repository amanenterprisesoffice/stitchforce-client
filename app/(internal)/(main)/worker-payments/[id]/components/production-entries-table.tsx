"use client"

import Link from "next/link"
import { ClipboardList, ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { formatDate, formatMoney } from "@/utils/utils"
import type { PaymentProductionEntry } from "../page"
import DataTable from "@/components/ui/DataTable"
import { useRouter } from "next/navigation"

export default function ProductionEntriesTable({
  entries,
}: {
  entries: PaymentProductionEntry[]
}) {
  const allocatedTotal = entries.reduce(
    (sum, entry) =>
      sum + Number(entry.allocated_amount ?? entry.total_amount ?? 0),
    0
  )

  const columns = [
    {
      header: "Production date",
      className: "whitespace-nowrap",
      render: (entry: PaymentProductionEntry) => (
        <span>{formatDate(entry.production_date)}</span>
      ),
    },
    {
      header: "Bundle",
      render: (entry: PaymentProductionEntry) => (
        <div>
          {entry.bundle?.id ? (
            <Link
              href={`/bundles/${entry.bundle.id}`}
              className="font-medium text-primary hover:underline"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {entry.bundle.bundle_number || entry.bundle.id}
            </Link>
          ) : (
            <span className="font-medium">{entry.bundle_id}</span>
          )}

          {entry.bundle?.status && (
            <p className="mt-1 text-xs text-muted-foreground capitalize">
              {entry.bundle.status.replace(/_/g, " ")}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Style",
      render: (entry: PaymentProductionEntry) => (
        <div>
          <p className="font-medium">{entry.style?.name || "—"}</p>

          {entry.style?.style_number && (
            <p className="text-xs text-muted-foreground">
              {entry.style.style_number}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Operation",
      render: (entry: PaymentProductionEntry) => (
        <span>{entry.operation?.name || "—"}</span>
      ),
    },
    {
      header: "Quantity",
      className: "text-right whitespace-nowrap tabular-nums",
      render: (entry: PaymentProductionEntry) => (
        <span>{Number(entry.quantity).toLocaleString("en-IN")} pcs</span>
      ),
    },
    {
      header: "Rate / piece",
      className: "text-right whitespace-nowrap tabular-nums",
      render: (entry: PaymentProductionEntry) => (
        <span>{formatMoney(entry.rate_per_piece)}</span>
      ),
    },
    // {
    //   header: "Entry total",
    //   className: "text-right whitespace-nowrap font-medium tabular-nums",
    //   render: (entry: PaymentProductionEntry) => (
    //     <span>{formatMoney(entry.total_amount)}</span>
    //   ),
    // },
    {
      header: "Allocated",
      className: "text-right whitespace-nowrap font-semibold tabular-nums",
      render: (entry: PaymentProductionEntry) => (
        <span>{formatMoney(entry.allocated_amount ?? entry.total_amount)}</span>
      ),
    },
  ]

  const router = useRouter()
  return (
    <div className="w-full min-w-0 shadow-none">
      <div className="flex flex-col gap-2 py-5 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="size-4 text-muted-foreground" />
            Production entries
            <Badge variant="secondary">{entries.length}</Badge>
          </CardTitle>

          <CardDescription className="mt-1">
            Production records allocated to this worker payment
          </CardDescription>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-muted-foreground">Allocated total</p>
          <p className="text-lg font-semibold tabular-nums">
            {formatMoney(allocatedTotal)}
          </p>
        </div>
      </div>

      <CardContent className="min-w-0">
        <DataTable
          data={entries}
          columns={columns}
          getRowId={(entry) => String(entry.id)}
          onRowClick={(entry) => {
            router.push(`/production-entries/${entry.id}`)
          }}
          emptyMessage="No production entries are linked to this payment."
          className="min-w-0 border-0"
        />
      </CardContent>
    </div>
  )
}
