"use client"

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
import { formatMoney } from "@/utils/utils"
import type { WorkerPayment } from "../page"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: WorkerPayment
  onConfirm: () => Promise<void>
  isVoiding: boolean
}

export default function VoidPaymentDialog({
  open,
  onOpenChange,
  payment,
  onConfirm,
  isVoiding,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Void this payment?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark the payment of {formatMoney(payment.amount)} as voided.
            The payment record will remain available for audit purposes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isVoiding}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isVoiding}
            onClick={(event) => {
              event.preventDefault()
              void onConfirm()
            }}
          >
            {isVoiding && <Loader spinnerClassName="size-4" variant="destructive" />}
            Void payment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
