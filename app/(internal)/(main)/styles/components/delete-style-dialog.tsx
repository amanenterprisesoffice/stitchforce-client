
"use client"

import { Loader2 } from "lucide-react"

import type { Style } from "../../../../../utils/zodSchema/style"

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
import Loader from "@/components/ui/Loader"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  style: Style | null
  onDelete: () => void
  isDeleting: boolean
  onCancel: () => void
}

export default function DeleteStyleDialog({
  open,
  onOpenChange,
  style,
  onDelete,
  isDeleting,
  onCancel,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>

        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete this style?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {style?.name}
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
            onClick={onDelete}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting && (
              <Loader spinnerClassName="h-4 w-4" variant="destructive"/>
            )}

            Delete Style
          </AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  )
}
