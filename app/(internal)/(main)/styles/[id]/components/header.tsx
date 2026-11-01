
"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Props {
  count: number
  onCreate: () => void
}

export default function OperationsHeader({
  count,
  onCreate,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Manufacturing Operations
          </h2>

          <Badge variant="secondary">
            {count}
          </Badge>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage operations and their per-piece rates for this style.
        </p>
      </div>

      <Button onClick={onCreate}>
        <Plus className="size-4" />
        Add Operation
      </Button>
    </div>
  )
}
