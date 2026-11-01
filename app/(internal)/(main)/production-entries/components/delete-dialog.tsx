"use client"
import { Loader2 } from "lucide-react"
import type { ProductionEntry } from "../schema"
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
  entry: ProductionEntry | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onDelete: () => void
  isDeleting: boolean
}
export default function DeleteProductionEntryDialog(p: Props) {
  return (
    <AlertDialog open={p.open} onOpenChange={p.onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete production entry?</AlertDialogTitle>
          <AlertDialogDescription>
            This entry for <strong>{p.entry?.quantity ?? 0} pieces</strong> will
            be soft-deleted and removed from active production records. This
            action does not create or change a worker payment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={p.isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={p.onDelete}
            disabled={p.isDeleting}
          >
            {p.isDeleting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Delete entry
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
