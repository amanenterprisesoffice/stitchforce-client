"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import type { ProductionEntry } from "../../../../../utils/zodSchema/production-entry"
import type { GarmentWorker } from "../../../../../utils/zodSchema/garmentWorker"
import { formatMoney } from "@/lib/utils"
import { getWorkerName } from "../../../../../utils/zodSchema/garmentWorker"
export default function RecentEntriesTable({
  entries,
  workers,
}: {
  entries: ProductionEntry[]
  workers: Map<string, GarmentWorker>
}) {
  return (
    <Card className="pt-0 shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Rate / pc</TableHead>
              <TableHead className="text-right">Earnings</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">
                  {getWorkerName(workers.get(e.worker_id))}
                </TableCell>
                <TableCell>
                  {new Date(e.production_date).toLocaleDateString("en-IN")}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {e.quantity}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMoney(e.rate_per_piece)}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatMoney(e.total_amount)}
                </TableCell>
                <TableCell className="max-w-[220px] truncate text-muted-foreground">
                  {e.remarks || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
