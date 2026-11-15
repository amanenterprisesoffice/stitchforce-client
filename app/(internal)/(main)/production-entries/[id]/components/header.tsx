"use client"

import { Book, Pencil, Trash2 } from "lucide-react"

import type { ProductionEntry } from "@/utils/types/production-entry"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/ui/PageHeader"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

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
  const { hasPermission } = usePermissions()

  const canUpdate = hasPermission(PERMISSIONS.PRODUCTION_UPDATE)
  const canDelete = hasPermission(PERMISSIONS.PRODUCTION_DELETE)

  return (
    <PageHeader
      title="Production entry"
      icon={<Book className="size-5 text-muted-foreground" />}
      badge={
        <Badge variant="secondary" className="font-mono">
          {entry.id.slice(0, 8)}...
        </Badge>
      }
      action={
        canUpdate || canDelete ? (
          <div className="flex flex-wrap gap-2">
            {canUpdate && (
              <Button variant="outline" onClick={onEdit}>
                <Pencil className="mr-2 size-4" />
                Edit entry
              </Button>
            )}

            {canDelete && (
              <Button variant="destructive" onClick={onDelete}>
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            )}
          </div>
        ) : undefined
      }
      description="Review the worker, bundle, operation, quantity, and payment details for this production record."
    />
  )
}