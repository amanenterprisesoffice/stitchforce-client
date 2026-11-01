"use client"
import { Badge } from "@/components/ui/badge"
export default function ProductionEntriesHeader({ count }: { count: number }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Production entries
        </h1>
        <Badge variant="secondary">{count}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Record worker output, track bundle progress, and review piece-rate
        earnings.
      </p>
    </div>
  )
}
