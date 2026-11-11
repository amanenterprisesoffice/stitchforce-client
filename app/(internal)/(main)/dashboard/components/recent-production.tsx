"use client"

import { useRouter } from "next/navigation"
import { Scissors, ArrowUpRight } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/DataTable"

import { getInitials, formatDate, formatMoney } from "@/utils/utils"

import { getWorkerName } from "@/utils/types/garmentWorker"
import type { ProductionEntry } from "@/utils/types/production-entry"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkerInfo } from "@/components/ui/worker-avatar"

interface Props {
  entries: ProductionEntry[] | null
  isLoading: boolean
}

export default function RecentProduction({ entries, isLoading }: Props) {
  const router = useRouter()
  if (!entries) entries = []

  const columns = [
    {
      header: "Date",
      className: "whitespace-nowrap",
      render: (entry: ProductionEntry) => formatDate(entry.production_date),
    },
    {
      header: "Worker",
      render: (entry: ProductionEntry) => {
        return <WorkerInfo worker={entry.worker} ignoreFields={["phone"]} />
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
      render: (entry: ProductionEntry) => formatMoney(entry.total_amount),
    },
  ]

  return (
    <Card className="pb-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-lg">Recent production</CardTitle>

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
          data={entries ?? []}
          columns={columns}
          getRowId={(entry) => entry?.id ?? ""}
          onRowClick={(entry) => router.push(`/production-entries/${entry?.id}`)}
          emptyMessage="No production entries found."
          isLoading={isLoading}
          className="rounded-none"
        />
      </CardContent>
    </Card>
  )
}
