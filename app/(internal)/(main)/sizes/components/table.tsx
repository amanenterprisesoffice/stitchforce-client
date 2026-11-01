
"use client"

import { MoreHorizontal, Pencil, Trash2, Ruler } from "lucide-react"

import type { Size } from "@/utils/zodSchema/size"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

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
  sizes: Size[]
  onEdit: (size: Size) => void
  onDelete: (size: Size) => void
}

export default function SizesTable({
  sizes,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Card className="w-full pt-0 shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size Name</TableHead>
              <TableHead className="hidden sm:table-cell">
                Created
              </TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {sizes.map((size) => (
              <TableRow key={size.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                      <Ruler className="size-4 text-muted-foreground" />
                    </div>

                    <span className="font-medium">
                      {size.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {size.created_at
                    ? new Date(size.created_at).toLocaleDateString()
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
