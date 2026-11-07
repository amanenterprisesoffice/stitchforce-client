"use client"

import Link from "next/link"
import { ArrowLeft, Ban, CreditCard } from "lucide-react"
import PageHeader from "@/components/ui/PageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { WorkerPayment } from "../page"

interface Props {
  payment: WorkerPayment
  onVoid: () => void
}

export default function PaymentDetailsHeader({ payment, onVoid }: Props) {
  const statusVariant =
    payment.status === "completed"
      ? "default"
      : payment.status === "voided"
        ? "destructive"
        : "secondary"

  return (
    <div className="space-y-3">
      <PageHeader
        title="Worker payment"
        icon={<CreditCard className="size-5 text-muted-foreground" />}
        description="Payment record, worker information, and the production entries covered by this payment."
        badge={
          <Badge variant={statusVariant} className="capitalize">
            {payment.status}
          </Badge>
        }
        // action={
        //   payment.status === "completed" ? (
        //     <Button variant="destructive" onClick={onVoid}>
        //       <Ban className="mr-2 size-4" />
        //       Void payment
        //     </Button>
        //   ) : null
        // }
      />
    </div>
  )
}
