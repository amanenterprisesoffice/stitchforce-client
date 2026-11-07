"use client"

import { useRouter } from "next/navigation"
import { Scissors } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/DataTable"

import { getInitials, formatDate, formatMoney } from "@/utils/utils"
import { getWorkerName } from "@/utils/zodSchema/garmentWorker"
import type { ProductionEntry } from "@/utils/zodSchema/production-entry"

interface Props {
  entries: ProductionEntry[]
  isLoading: boolean
}

export default function ProductionEntriesTable({ entries, isLoading }: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Production date",
      className: "whitespace-nowrap",
      render: (entry: ProductionEntry) => formatDate(entry.production_date),
    },
    {
      header: "Worker",
      render: (entry: ProductionEntry) => {
        const workerName = getWorkerName(entry.worker)

        return (
          <div className="flex min-w-[180px] items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage
                src={entry.worker?.photo_url || undefined}
                alt={workerName}
              />
              <AvatarFallback>{getInitials(workerName)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate font-medium">{workerName}</p>
              <p className="text-xs text-muted-foreground">
                {entry.worker?.phone || "—"}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      header: "Bundle / Style",
      render: (entry: ProductionEntry) => (
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
      render: (entry: ProductionEntry) => (
        <Badge variant="outline">
          <Scissors className="mr-1 size-3" />
          {entry.operation?.name || "Unknown operation"}
        </Badge>
      ),
    },
    {
      header: "Qty",
      className: "text-right tabular-nums",
      render: (entry: ProductionEntry) =>
        Number(entry.quantity || 0).toLocaleString("en-IN"),
    },
    {
      header: "Rate / pc",
      className: "text-right whitespace-nowrap tabular-nums",
      render: (entry: ProductionEntry) => formatMoney(entry.rate_per_piece),
    },
  ]

  return (
    <DataTable
      data={entries}
      columns={columns}
      getRowId={(entry) => entry.id}
      onRowClick={(entry) => router.push(`/production-entries/${entry.id}`)}
      emptyMessage="No production entries found."
      isLoading={isLoading}
    />
  )
}
