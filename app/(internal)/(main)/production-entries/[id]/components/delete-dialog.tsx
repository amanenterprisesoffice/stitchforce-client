"use client"

import type { ProductionEntry } from "@/utils/zodSchema/production-entry"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Loader from "@/components/ui/Loader"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: ProductionEntry
  onDelete: () => void
  isDeleting: boolean
  onCancel: () => void
}

export default function DeleteProductionEntryDialog({
  open,
  onOpenChange,
  entry,
  onDelete,
  isDeleting,
  onCancel,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this production entry?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this entry for{" "}
            <span className="font-medium text-foreground">
              {entry.worker?.name || "this worker"}
            </span>{" "}
            ({entry.quantity} pieces)? This action will remove the record from the active production entries list.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete} disabled={isDeleting}>
            {isDeleting && <Loader spinnerClassName="h-4 w-4" variant="destructive"/>}
            Delete entry
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
