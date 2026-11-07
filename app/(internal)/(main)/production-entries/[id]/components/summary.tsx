"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { IndianRupee, PackageCheck } from "lucide-react"
import { formatMoney, getInitials } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProductionEntry } from "@/utils/zodSchema/production-entry"

const ProdEntrySummary = ({ entry }: { entry: ProductionEntry }) => {
  const router = useRouter()
  const worker = entry.worker

  const summaryItems = [
    {
      label: "Quantity completed",
      value: `${Number(entry.quantity || 0).toLocaleString("en-IN")} pcs`,
      icon: PackageCheck,
    },
    {
      label: "Rate per piece",
      value: formatMoney(entry.rate_per_piece),
      icon: IndianRupee,
    },
    {
      label: "Total amount",
      value: formatMoney(entry.total_amount),
      icon: IndianRupee,
      prominent: true,
    },
  ]

  return (
    <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map(({ label, value, icon: Icon, prominent }) => (
        <Card key={label} className="min-w-0 p-0 shadow-none">
          <CardContent className="flex min-w-0 items-center justify-between gap-3 p-4">
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

      {/* Worker summary card */}
      <Card
        onClick={() => worker?.id && router.push(`/workers/${worker.id}`)}
        className="h-full min-w-0 cursor-pointer p-0 shadow-none transition-colors hover:bg-muted/50"
      >
        <CardContent className="flex h-full min-w-0 items-center gap-3 p-4">
          <Avatar className="size-11 shrink-0">
            <AvatarImage
              src={worker?.photo_url || undefined}
              alt={worker?.name || "Worker"}
            />
            <AvatarFallback>
              {getInitials(worker?.name || "Unknown worker")}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Worker</p>
            <p className="truncate font-semibold">
              {worker?.name || "Unknown worker"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {worker?.phone || "No phone number"}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default ProdEntrySummary
