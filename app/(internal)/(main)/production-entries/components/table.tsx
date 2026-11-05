"use client"

import { Scissors } from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getInitials, formatDate, formatMoney } from "@/lib/utils"

import { getWorkerName } from "@/utils/zodSchema/garmentWorker"
import type { ProductionEntry } from "@/utils/zodSchema/production-entry"

interface ProductionEntriesTableProps {
  entries: ProductionEntry[]
  onView: (entry: ProductionEntry) => void
}

export default function ProductionEntriesTable({
  entries,
  onView,
}: ProductionEntriesTableProps) {
  const router = useRouter()

  return (
    <Card className="h-full w-full pt-0 shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Production date</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Bundle / Style</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Rate / pc</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No production entries found.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => {
                const workerName = getWorkerName(entry.worker)

                return (
                  <TableRow
                    key={entry.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/production-entries/${entry.id}`)
                    }
                  >
                    {/* Production date */}
                    <TableCell className="whitespace-nowrap">
                      {formatDate(entry.production_date)}
                    </TableCell>

                    {/* Worker */}
                    <TableCell>
                      <div className="flex min-w-[180px] items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage
                            src={entry.worker?.photo_url || undefined}
                            alt={workerName}
                          />
                          <AvatarFallback>
                            {getInitials(workerName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate font-medium">{workerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.worker?.phone || "—"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Bundle / Style */}
                    <TableCell>
                      <div className="min-w-[150px]">
                        <p className="font-medium">
                          {entry.bundle?.bundle_number || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.style?.style_number
                            ? `${entry.style.style_number} · `
                            : ""}
                          {entry.style?.name || "Unknown style"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Operation */}
                    <TableCell>
                      <Badge variant="outline">
                        <Scissors className="mr-1 size-3" />
                        {entry.operation?.name || "Unknown operation"}
                      </Badge>
                    </TableCell>

                    {/* Quantity */}
                    <TableCell className="text-right tabular-nums">
                      {Number(entry.quantity || 0).toLocaleString("en-IN")}
                    </TableCell>

                    {/* Rate per piece */}
                    <TableCell className="text-right whitespace-nowrap tabular-nums">
                      {formatMoney(entry.rate_per_piece)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
