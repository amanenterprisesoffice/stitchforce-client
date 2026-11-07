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
  entry: ProductionEntry | null
  open: boolean
  onOpenChange: (value: boolean) => void
  onDelete: () => void
  isDeleting: boolean
}

export default function DeleteProductionEntryDialog(props: Props) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete production entry?</AlertDialogTitle>
          <AlertDialogDescription>
            This entry for <strong>{props.entry?.quantity ?? 0} pieces</strong> will
            be soft-deleted and removed from active production records. This
            action does not create or change a worker payment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={props.isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={props.onDelete}
            disabled={props.isDeleting}
          >
            {props.isDeleting && <Loader spinnerClassName="h-4 w-4" variant="destructive"/>}
            Delete entry
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
