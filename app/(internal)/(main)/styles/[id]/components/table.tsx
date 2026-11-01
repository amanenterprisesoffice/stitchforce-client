"use client"

import { MoreHorizontal, Pencil, Trash2, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { CopyButton } from "@/components/ui/CopyButton"

export interface StyleOperation {
  id: string
  organization_id: string
  style_id: string
  name: string
  rate_per_piece: number
  created_at: string
  updated_at: string
}

interface Props {
  operations: StyleOperation[]
  onEdit: (operation: StyleOperation) => void
  onDelete: (operation: StyleOperation) => void
}

function formatRate(rateInPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(rateInPaise) / 100)
}

export default function StyleOperationsTable({
  operations,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Card className="h-full w-full pt-0 shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID.</TableHead>

              <TableHead>Operation Name</TableHead>

              <TableHead>Rate Per Piece</TableHead>

              <TableHead className="hidden sm:table-cell">Created</TableHead>

              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {operations.map((operation, index) => (
              <TableRow key={operation?.id ?? index}>
                <TableCell>
                  <Badge variant="outline" className="p-3!">
                    <CopyButton
                      label={`${operation?.id?.slice(0, 5) ?? ""}..`}
                      value={operation?.id ?? ""}
                    />
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="hidden size-9 items-center justify-center rounded-lg bg-muted sm:flex">
                      <Settings2 className="size-4 text-muted-foreground" />
                    </div>

                    <span className="font-medium">{operation?.name ?? ""}</span>
                  </div>
                </TableCell>

                <TableCell className="font-medium tabular-nums">
                  {operation?.rate_per_piece != null
                    ? formatRate(operation.rate_per_piece)
                    : ""}
                </TableCell>

                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {operation?.created_at
                    ? new Date(operation.created_at).toLocaleDateString()
                    : "—"}
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
                      <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(operation)}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(operation)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
