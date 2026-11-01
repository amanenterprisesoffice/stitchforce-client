"use client"
import type {
  ProductionEntry,
  ProductionWorker,
  ProductionBundle,
  StyleOperation,
} from "../schema"
import { getWorkerName, formatMoney } from "../schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
interface Props {
  entry: ProductionEntry | null
  open: boolean
  onOpenChange: (v: boolean) => void
  worker?: ProductionWorker
  bundle?: ProductionBundle
  operation?: StyleOperation
}
export default function ProductionEntryDetailsDialog(p: Props) {
  if (!p.entry) return null
  const e = p.entry
  return (
    <Dialog open={p.open} onOpenChange={p.onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Production entry details</DialogTitle>
          <DialogDescription>
            Recorded output and calculated piece-rate earnings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground">Worker</div>
            <div className="mt-1 text-lg font-semibold">
              {getWorkerName(p.worker)}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">
                {p.bundle?.bundle_number || "Bundle"}
              </Badge>
              <Badge variant="secondary">
                {p.operation?.name || "Operation"}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              [
                "Production date",
                new Date(e.production_date).toLocaleString("en-IN"),
              ],
              ["Quantity", `${e.quantity} pieces`],
              ["Rate per piece", formatMoney(e.rate_per_piece)],
              ["Total earnings", formatMoney(e.total_amount)],
            ].map(([k, v]) => (
              <div key={k} className="space-y-1">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="text-sm font-semibold tabular-nums">{v}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Remarks</p>
            <p className="mt-1 text-sm whitespace-pre-wrap">
              {e.remarks || "No remarks."}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Payment status is managed separately in the worker payment
            interface.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => p.onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
