"use client"

import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableColumn<T> {
  header: string
  className?: string
  render?: (item: T) => ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  getRowId: (item: T) => string
  onRowClick?: (item: T) => void
  emptyMessage?: string
  className?: string
  tableContainerClassName?: string
}

export default function DataTable<T>({
  data,
  columns,
  getRowId,
  onRowClick,
  emptyMessage = "No records found.",
  className = "",
  tableContainerClassName = "",
}: DataTableProps<T>) {
  return (
    <Card className={`h-full w-full pt-0! pb-0! shadow-none ${className}`}>
      <CardContent className="p-0">
        <Table
          variant="surface"
          stickyHeader
          containerClassName={`max-h-full ${tableContainerClassName}`}
        >
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow
                  key={getRowId(item)}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, index) => (
                    <TableCell key={index} className={column.className}>
                      {column.render ? column.render(item) : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
