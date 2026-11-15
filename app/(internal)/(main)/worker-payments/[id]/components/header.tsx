"use client"

import { Ban, CreditCard } from "lucide-react"

import PageHeader from "@/components/ui/PageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { WorkerPayment } from "../page"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

interface Props {
  payment: WorkerPayment
  onVoid: () => void
}

export default function PaymentDetailsHeader({ payment, onVoid }: Props) {
  const { hasPermission } = usePermissions()

  const canUpdate = hasPermission(PERMISSIONS.PAYMENTS_UPDATE)

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
        action={
          payment.status === "completed" && canUpdate ? (
            <Button variant="destructive" onClick={onVoid}>
              <Ban className="size-4" />
              Void payment
            </Button>
          ) : undefined
        }
      />
    </div>
  )
}