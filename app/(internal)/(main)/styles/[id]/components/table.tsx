"use client"

import { MoreHorizontal, Pencil, Trash2, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/ui/CopyButton"
import DataTable from "@/components/ui/DataTable"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatMoney } from "@/utils/utils"

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
  isLoading: boolean
}


export default function StyleOperationsTable({
  operations,
  onEdit,
  onDelete,
  isLoading,
}: Props) {
  const columns = [
    {
      header: "ID.",
      className: "w-[100px]",
      render: (operation: StyleOperation) => (
        <Badge variant="outline" className="p-3!">
          <CopyButton
            label={`${operation?.id?.slice(0, 5) ?? ""}..`}
            value={operation?.id ?? ""}
          />
        </Badge>
      ),
    },
    {
      header: "Operation Name",
      render: (operation: StyleOperation) => (
        <div className="flex items-center gap-3">
          <div className="hidden size-9 items-center justify-center rounded-lg bg-muted sm:flex">
            <Settings2 className="size-4 text-muted-foreground" />
          </div>

          <span className="font-medium">
            {operation?.name ?? ""}
          </span>
        </div>
      ),
    },
    {
      header: "Rate Per Piece",
      className: "font-medium tabular-nums",
      render: (operation: StyleOperation) =>
        operation?.rate_per_piece != null
          ? formatMoney(operation.rate_per_piece)
          : "",
    },
    {
      header: "Created",
      className: "hidden text-muted-foreground sm:table-cell",
      render: (operation: StyleOperation) =>
        operation?.created_at
          ? new Date(operation.created_at).toLocaleDateString()
          : "—",
    },
    {
      header: "",
      className: "w-[60px]",
      render: (operation: StyleOperation) => (
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
      ),
    },
  ]

  return (
    <DataTable
      data={operations}
      columns={columns}
      getRowId={(operation) => operation.id}
      emptyMessage="No operations found."
      className="h-full min-h-[70vh]"
      isLoading={isLoading}
    />
  )
}