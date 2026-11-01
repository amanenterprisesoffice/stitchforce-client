
"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Props {
  count: number
  onCreate: () => void
}

export default function BundlesHeader({ count, onCreate }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bundles
          </h1>

          <Badge variant="secondary">
            {count}
          </Badge>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage garment bundles, quantities, and manufacturing details.
        </p>
      </div>

      <Button onClick={onCreate}>
        <Plus className="size-4" />
        Create Bundle
      </Button>
    </div>
  )
}
