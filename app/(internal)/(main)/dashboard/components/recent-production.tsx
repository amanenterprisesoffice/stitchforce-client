
"use client"

import { useRouter } from "next/navigation"
import { Scissors, ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/DataTable"
import StateComponent from "@/components/StateComponent"

import { formatDate, formatMoney } from "@/utils/utils"

import type { ProductionEntry } from "@/utils/types/production-entry"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { WorkerInfo } from "@/components/ui/worker-avatar"

interface Props {
  entries: ProductionEntry[] | null
  isLoading: boolean
  error?: string | null
}

export default function RecentProduction({
  entries,
  isLoading,
  error,
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
      render: (entry: ProductionEntry) => (
        <WorkerInfo worker={entry.worker} />
      ),
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
      className: "whitespace-nowrap text-right tabular-nums",
      render: (entry: ProductionEntry) =>
        formatMoney(entry.total_amount),
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
        {error ? (
          <div className="px-4 pb-4">
            <StateComponent
              className="rounded-none"
              message={error || "Something went wrong"}
              description="An error occurred while loading recent production entries."
            />
          </div>
        ) : (
          <DataTable
            data={entries ?? []}
            columns={columns}
            getRowId={(entry) => entry?.id ?? ""}
            onRowClick={(entry) =>
              router.push(`/production-entries/${entry?.id}`)
            }
            emptyMessage="No production entries found."
            isLoading={isLoading}
            className="rounded-none"
          />
        )}
      </CardContent>
    </Card>
  )
}
