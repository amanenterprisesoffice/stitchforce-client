"use client"

import { MoreHorizontal, Pencil, Trash2, Eye, Package } from "lucide-react"
import { useRouter } from "next/navigation"

import type { Bundle } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { Size } from "@/utils/zodSchema/size"

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

interface Props {
  bundles: Bundle[]
  styles: Style[]
  sizes: Size[]

  onView: (bundle: Bundle) => void
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
  onView,
  onEdit,
  onDelete,
}: Props) {
  const router = useRouter()
  const styleMap = new Map(styles.map((style) => [style.id, style.name]))

  const sizeMap = new Map(sizes.map((size) => [size.id, size.name]))

  return (
    <Card className="w-full pt-0 shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bundle Number</TableHead>
              <TableHead>Style</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {bundles.map((bundle) => {
              const status = statusConfig[bundle.status] || {
                label: bundle.status || "Unknown",
                className: "",
              }

              return (
                <TableRow
                  className="cursor-pointer"
                  key={bundle.id}
                  onClick={() => router.push(`/bundles/${bundle.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        <Package className="size-4 text-muted-foreground" />
                      </div>

                      <span className="font-mono font-medium">
                        {bundle.bundle_number}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {styleMap.get(bundle.style_id) || "Unknown style"}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {sizeMap.get(bundle.size_id) || "Unknown size"}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-medium tabular-nums">
                    {bundle.quantity.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {bundle.created_at
                      ? new Date(bundle.created_at).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
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
                        <DropdownMenuItem onClick={() => onView(bundle)}>
                          <Eye className="mr-2 size-4" />
                          View Details
                        </DropdownMenuItem>

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
