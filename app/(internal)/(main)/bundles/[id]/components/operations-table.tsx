"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DataTable from "@/components/ui/DataTable"
import { WorkerInfo } from "@/components/ui/worker-avatar"

import { formatMoney } from "@/utils/utils"
import { BundleOperation } from "@/utils/zodSchema/bundle"

interface Props {
  operations: BundleOperation[]
  quantity: number
  isLoading?: boolean
}

export default function BundleOperationsTable({
  operations,
  quantity,
  isLoading = false,
}: Props) {
  const columns = [
    {
      header: "Operation",
      render: (operation: BundleOperation) => (
        <span className="font-medium">{operation.name}</span>
      ),
    },
    {
      header: "Worker",
      render: (operation: BundleOperation) => {
        const worker = operation.worker

        return worker ? (
          <WorkerInfo worker={worker} />
        ) : (
          <span className="text-sm text-muted-foreground">Not assigned</span>
        )
      },
    },
    {
      header: "Rate / piece",
      render: (operation: BundleOperation) => (
        <span className="font-medium tabular-nums">
          {formatMoney(operation.rate_per_piece)}
        </span>
      ),
    },
    {
      header: "Completed",
      render: (operation: BundleOperation) => (
        <span className="tabular-nums">
          {operation.completed_quantity} / {quantity}
        </span>
      ),
    },
    {
      header: "Pending",
      className: "hidden sm:table-cell",
      render: (operation: BundleOperation) => (
        <span className="tabular-nums">{operation.pending_quantity}</span>
      ),
    },
    {
      header: "Status",
      render: (operation: BundleOperation) => {
        const completed = operation.completed_quantity >= quantity
        const started = operation.completed_quantity > 0

        return (
          <Badge
            variant={completed ? "default" : started ? "secondary" : "outline"}
          >
            {completed ? "Completed" : started ? "In progress" : "Not started"}
          </Badge>
        )
      },
    },
  ]

  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <CardTitle>Production operations</CardTitle>
        <CardDescription>
          Workers assigned to each operation and their completion status.
        </CardDescription>
      </CardHeader>

      <DataTable
        data={operations}
        columns={columns}
        getRowId={(operation) => operation.id}
        emptyMessage="No operations found for this bundle."
        isLoading={isLoading}
        className="rounded-none"
      />
    </Card>
  )
}
