"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { formatMoney } from "@/utils/utils"
import type { WorkerPayment } from "@/utils/zodSchema/payments"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: WorkerPayment | null
  onConfirm: () => void
  isVoiding: boolean
}

export default function VoidPaymentDialog({ open, onOpenChange, payment, onConfirm, isVoiding }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Void this payment?</AlertDialogTitle>
          <AlertDialogDescription>
            {payment ? `This will void the payment of ${formatMoney(payment.amount)}. The payment record will remain available with voided status.` : "This payment will be marked as voided."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isVoiding}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={event => { event.preventDefault(); onConfirm() }} disabled={isVoiding} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isVoiding ? "Voiding..." : "Void payment"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
