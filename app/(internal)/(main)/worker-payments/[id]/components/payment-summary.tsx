"use client"

import Link from "next/link"
import { CalendarDays, IndianRupee, PackageCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate, formatMoney, getInitials } from "@/utils/utils"
import type { WorkerPayment } from "../page"
import { WorkerInfo } from "@/components/ui/worker-avatar"

export default function PaymentSummary({
  payment,
}: {
  payment: WorkerPayment
}) {
  const entries = payment.production_entry ?? []
  const worker = payment.worker

  const items = [
    {
      label: "Payment amount",
      value: formatMoney(payment.amount),
      icon: IndianRupee,
      prominent: true,
    },
    {
      label: "Production entries",
      value: entries.length.toLocaleString("en-IN"),
      icon: PackageCheck,
    },
    {
      label: "Payment date",
      value: formatDate(payment.payment_date),
      icon: CalendarDays,
    },
  ]

  return (
    <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon, prominent }) => (
        <Card key={label} className="min-w-0 shadow-none">
          <CardContent className="flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p
                className={`mt-1 truncate font-semibold tabular-nums ${
                  prominent ? "text-2xl" : "text-xl"
                }`}
              >
                {value}
              </p>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="size-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      ))}

      {worker && (
        <Link
          href={`/workers/${worker.id}`}
          className="min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Card className="h-full min-w-0 shadow-none transition-colors hover:bg-muted/50">
            <CardContent className="min-w-0 h-full flex items-center">
              <WorkerInfo worker={worker} />
            </CardContent>
          </Card>
        </Link>
      )}
    </section>
  )
}
