"use client"

import { MoreHorizontal, Pencil, Trash2, Ruler } from "lucide-react"

import type { Size } from "@/utils/zodSchema/size"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DataTable from "@/components/ui/DataTable"

interface Props {
  sizes: Size[]
  onEdit: (size: Size) => void
  onDelete: (size: Size) => void
}

export default function SizesTable({
  sizes,
  onEdit,
  onDelete,
}: Props) {
  const columns = [
    {
      header: "Size Name",
      render: (size: Size) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
            <Ruler className="size-4 text-muted-foreground" />
          </div>

          <span className="font-medium">{size.name}</span>
        </div>
      ),
    },
    {
      header: "Created",
      className: "hidden text-muted-foreground sm:table-cell",
      render: (size: Size) =>
        size.created_at
          ? new Date(size.created_at).toLocaleDateString()
          : "—",
    },
    {
      header: "",
      className: "w-[60px]",
      render: (size: Size) => (
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
            <DropdownMenuItem onClick={() => onEdit(size)}>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(size)}
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
      data={sizes}
      columns={columns}
      getRowId={(size) => size.id}
      emptyMessage="No sizes found."
    />
  )
}