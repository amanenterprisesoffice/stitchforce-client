"use client"

import { CreditCard } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDate, prettifyKey } from "@/utils/utils"
import type { WorkerPayment } from "../page"

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-medium break-all">
        {value || "—"}
      </span>
    </div>
  )
}

export default function TransactionCard({
  payment,
}: {
  payment: WorkerPayment
}) {
  return (
    <Card className="w-full! min-w-0 shadow-none">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="size-4 text-muted-foreground" />
          Transaction details
        </CardTitle>
        <CardDescription>Payment method and audit information</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
        <DetailRow
          label="Payment method"
          value={prettifyKey(payment.payment_method)}
        />

        <DetailRow label="Reference" value={payment.reference || "—"} />

        <DetailRow
          label="Payment date"
          value={formatDate(payment.payment_date)}
        />

        <DetailRow label="Payment ID" value={payment.id} />

        <DetailRow label="Created" value={formatDate(payment.created_at)} />

        <DetailRow
          label="Last updated"
          value={payment.updated_at ? formatDate(payment.updated_at) : "—"}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-1">
        <p className="text-sm text-muted-foreground">Remarks</p>
        <p className="text-sm break-words whitespace-pre-wrap">
          {payment.remarks?.trim() || "No remarks added"}
        </p>
      </CardFooter>
    </Card>
  )
}
