"use client"

import { useRouter } from "next/navigation"

import { MoreHorizontal, Pencil, Trash2, Shirt } from "lucide-react"

import type { Style } from "@/utils/types/style"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DataTable from "@/components/ui/DataTable"

interface Props {
  styles: Style[]
  onEdit: (style: Style) => void
  onDelete: (style: Style) => void
  isLoading: boolean
}

export default function StylesTable({ styles, onEdit, onDelete, isLoading }: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Style Number",
      render: (style: Style) => (
        <Badge variant="outline" className="font-mono">
          {style.style_number}
        </Badge>
      ),
    },
    {
      header: "Name",
      render: (style: Style) => (
        <div className="flex items-center gap-3">
          <div className="hidden size-9 items-center justify-center rounded-lg bg-muted sm:flex">
            <Shirt className="size-4 text-muted-foreground" />
          </div>

          <span className="font-medium">{style.name}</span>
        </div>
      ),
    },
    {
      header: "Description",
      className: "hidden max-w-[250px] truncate text-muted-foreground md:table-cell",
      render: (style: Style) => style.description || "—",
    },
    {
      header: "Created",
      className: "hidden text-muted-foreground sm:table-cell",
      render: (style: Style) =>
        style.created_at
          ? new Date(style.created_at).toLocaleDateString()
          : "—",
    },
    {
      header: "",
      className: "w-[60px]",
      render: (style: Style) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={(e) => e.stopPropagation()}
              />
            }
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem onClick={() => onEdit(style)}>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(style)}
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
      data={styles}
      columns={columns}
      getRowId={(style) => style.id}
      onRowClick={(style) => router.push(`/styles/${style.id}`)}
      emptyMessage="No styles found."
      isLoading={isLoading}
    />
  )
}