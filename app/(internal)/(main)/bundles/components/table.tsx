"use client"

import { MoreHorizontal, Pencil, Trash2, Package } from "lucide-react"
import { useRouter } from "next/navigation"

import type { Bundle } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { Size } from "@/utils/zodSchema/size"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/DataTable"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Props {
  bundles: Bundle[]
  styles: Style[]
  sizes: Size[]
  onEdit: (bundle: Bundle) => void
  onDelete: (bundle: Bundle) => void
}

const statusConfig: Record<string, { label: string; className: string }> = {
  created: {
    label: "Created",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  ready: {
    label: "Ready",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-200",
  },
}

export default function BundlesTable({
  bundles,
  styles,
  sizes,
  onEdit,
  onDelete,
}: Props) {
  const router = useRouter()

  const styleMap = new Map(styles.map((style) => [style.id, style.name]))
  const sizeMap = new Map(sizes.map((size) => [size.id, size.name]))

  const columns = [
    {
      header: "Bundle Number",
      render: (bundle: Bundle) => (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
            <Package className="size-4 text-muted-foreground" />
          </div>

          <span className="font-mono font-medium">{bundle.bundle_number}</span>
        </div>
      ),
    },
    {
      header: "Style",
      render: (bundle: Bundle) =>
        styleMap.get(bundle.style_id) || "Unknown style",
    },
    {
      header: "Size",
      render: (bundle: Bundle) => (
        <Badge variant="outline">
          {sizeMap.get(bundle.size_id) || "Unknown size"}
        </Badge>
      ),
    },
    {
      header: "Quantity",
      className: "font-medium tabular-nums",
      render: (bundle: Bundle) => bundle.quantity.toLocaleString(),
    },
    {
      header: "Status",
      render: (bundle: Bundle) => {
        const status = statusConfig[bundle.status] || {
          label: bundle.status || "Unknown",
          className: "",
        }

        return (
          <Badge variant="outline" className={status.className}>
            {status.label}
          </Badge>
        )
      },
    },
    {
      header: "Created",
      className: "hidden text-muted-foreground md:table-cell",
      render: (bundle: Bundle) =>
        bundle.created_at
          ? new Date(bundle.created_at).toLocaleDateString()
          : "—",
    },
    {
      header: "",
      className: "w-[60px]",
      render: (bundle: Bundle) => (
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

          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => onEdit(bundle)}>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(bundle)}
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
      data={bundles}
      columns={columns}
      getRowId={(bundle) => bundle.id}
      onRowClick={(bundle) => router.push(`/bundles/${bundle.id}`)}
      emptyMessage="No bundles found."
      tableContainerClassName="flex-1"
    />
  )
}
