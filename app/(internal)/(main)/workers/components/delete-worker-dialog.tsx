
"use client"

import { Loader2 } from "lucide-react"

import type { GarmentWorker } from "../../../../../utils/zodSchema/garmentWorker"

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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  worker: GarmentWorker | null
  onDelete: () => void
  isDeleting: boolean
  onCancel: () => void
}

export default function DeleteWorkerDialog({
  open,
  onOpenChange,
  worker,
  onDelete,
  isDeleting,
  onCancel,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>

        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete this worker?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {worker?.name}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}

            Delete Worker
          </AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  )
}
