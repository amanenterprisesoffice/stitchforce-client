
"use client"

import { Loader2 } from "lucide-react"

import type { Size } from "@/utils/zodSchema/size"

import { Button } from "@/components/ui/button"

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
  size: Size | null
  onDelete: () => void
  isDeleting: boolean
  onCancel: () => void
}

export default function DeleteSizeDialog({
  open,
  onOpenChange,
  size,
  onDelete,
  isDeleting,
  onCancel,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete this size?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {size?.name}
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

            Delete Size
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
