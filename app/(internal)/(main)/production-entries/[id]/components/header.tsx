"use client"

import Link from "next/link"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"

import type { ProductionEntry } from "@/utils/zodSchema/production-entry"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Props {
  entry: ProductionEntry
  onEdit: () => void
  onDelete: () => void
}

export default function ProductionEntryHeader({ entry, onEdit, onDelete }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" render={<Link href="/production-entries" />}>
          <ArrowLeft className="mr-2 size-4" />
          Back to entries
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Pencil className="mr-2 size-4" />
            Edit entry
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Production entry</h1>
          <Badge variant="secondary" className="font-mono">
            {entry.id.slice(0, 8)}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Review the worker, bundle, operation, quantity, and payment details for this production record.
        </p>
      </div>
    </div>
  )
}
