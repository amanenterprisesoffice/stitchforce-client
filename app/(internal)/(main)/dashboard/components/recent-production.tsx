"use client"

import { useRouter } from "next/navigation"
import { Scissors, ArrowUpRight } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/DataTable"

import {
  getInitials,
  formatDate,
  formatMoney,
} from "@/utils/utils"

import { getWorkerName } from "@/utils/zodSchema/garmentWorker"
import type { ProductionEntry } from "@/utils/zodSchema/production-entry"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  entries: ProductionEntry[]
  isLoading: boolean
}

export default function RecentProduction({
  entries,
  isLoading,
}: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Date",
      className: "whitespace-nowrap",
      render: (entry: ProductionEntry) =>
        formatDate(entry.production_date),
    },
    {
      header: "Worker",
      render: (entry: ProductionEntry) => {
        const workerName = getWorkerName(entry.worker)

        return (
          <div className="flex min-w-[150px] items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarImage
                src={entry.worker?.photo_url || undefined}
                alt={workerName}
              />
              <AvatarFallback>
                {getInitials(workerName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate font-medium">
                {workerName}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.worker?.phone || "—"}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      header: "Bundle",
      render: (entry: ProductionEntry) => (
        <span className="font-medium">
          {entry.bundle?.bundle_number || "—"}
        </span>
      ),
    },
    {
      header: "Operation",
      render: (entry: ProductionEntry) => (
        <Badge variant="outline">
          <Scissors className="mr-1 size-3" />
          {entry.operation?.name || "—"}
        </Badge>
      ),
    },
    {
      header: "Quantity",
      className: "text-right tabular-nums",
      render: (entry: ProductionEntry) =>
        Number(entry.quantity || 0).toLocaleString("en-IN"),
    },
    {
      header: "Amount",
      className: "text-right whitespace-nowrap tabular-nums",
      render: (entry: ProductionEntry) =>
        formatMoney(entry.total_amount),
    },
  ]

  return (
    <Card className="shadow-sm pb-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-lg">
          Recent production
        </CardTitle>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => router.push("/production-entries")}
        >
          View all
          <ArrowUpRight className="ml-1 size-4" />
        </Button>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <DataTable
          data={entries}
          columns={columns}
          getRowId={(entry) => entry.id}
          onRowClick={(entry) =>
            router.push(`/production-entries/${entry.id}`)
          }
          emptyMessage="No production entries yet."
          isLoading={isLoading}
          className="rounded-none"
        />
      </CardContent>
    </Card>
  )
}