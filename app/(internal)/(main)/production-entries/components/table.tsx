"use client"
import { MoreHorizontal, Eye, Pencil, Trash2, Scissors } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  ProductionEntry,
  ProductionWorker,
  ProductionBundle,
  ProductionStyle,
  StyleOperation,
} from "../schema"
import { getWorkerName, formatMoney } from "../schema"

interface Props {
  entries: ProductionEntry[]
  workers: Map<string, ProductionWorker>
  bundles: Map<string, ProductionBundle>
  styles: Map<string, ProductionStyle>
  operations: Map<string, StyleOperation>
  onView: (e: ProductionEntry) => void
  onEdit: (e: ProductionEntry) => void
  onDelete: (e: ProductionEntry) => void
}
export default function ProductionEntriesTable(p: Props) {
  return (
    <Card className="w-full pt-0 shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Production date</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Bundle / style</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Rate / pc</TableHead>
              <TableHead className="text-right">Earnings</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {p.entries.map((e) => {
              const b = p.bundles.get(e.bundle_id)
              const s = b ? p.styles.get(b.style_id) : undefined
              const op = p.operations.get(e.style_operation_id)
              return (
                <TableRow key={e.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(e.production_date).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {getWorkerName(p.workers.get(e.worker_id))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.workers.get(e.worker_id)?.worker_code || ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm font-medium">
                      {b?.bundle_number || "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s?.style_number ? `${s.style_number} · ` : ""}
                      {s?.name || "Unknown style"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {op?.name || "Unknown operation"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {e.quantity.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(e.rate_per_piece)}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatMoney(e.total_amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          />
                        }
                      >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Entry actions</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => p.onView(e)}>
                          <Eye className="mr-2 size-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => p.onEdit(e)}>
                          <Pencil className="mr-2 size-4" />
                          Edit entry
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => p.onDelete(e)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete entry
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
