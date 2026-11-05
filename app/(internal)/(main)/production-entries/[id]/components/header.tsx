"use client"

import Link from "next/link"
import { ArrowLeft, Book, Pencil, Trash2 } from "lucide-react"

import type { ProductionEntry } from "@/utils/zodSchema/production-entry"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/ui/PageHeader"

interface Props {
  entry: ProductionEntry
  onEdit: () => void
  onDelete: () => void
}

export default function ProductionEntryHeader({
  entry,
  onEdit,
  onDelete,
}: Props) {
  return (
    <PageHeader
      title="Production entry"
      // backlink="/production-entries"
      icon={<Book className="size-5 text-muted-foreground" />}
      badge={
        <Badge variant="secondary" className="font-mono">
          {entry.id.slice(0, 8)}
        </Badge>
      }
      action={
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
      }
      description="Review the worker, bundle, operation, quantity, and payment details for this production record."
    />
  )
}
