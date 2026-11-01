"use client"
import { useRouter } from "next/navigation"

import { MoreHorizontal, Pencil, Trash2, Shirt } from "lucide-react"

import type { Style } from "../../../../../utils/zodSchema/style"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  styles: Style[]
  onEdit: (style: Style) => void
  onDelete: (style: Style) => void
}

export default function StylesTable({ styles, onEdit, onDelete }: Props) {
  const router = useRouter()
  return (
    <Card className="w-full pt-0 shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Style Number</TableHead>
              <TableHead>Name</TableHead>

              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>

              <TableHead className="hidden sm:table-cell">Created</TableHead>

              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {styles.map((style) => (
              <TableRow
                className={"cursor-pointer"}
                key={style.id}
                onClick={() => router.push(`/styles/${style.id}`)}
              >
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {style.style_number}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="hidden size-9 items-center justify-center rounded-lg bg-muted sm:flex">
                      <Shirt className="size-4 text-muted-foreground" />
                    </div>

                    <span className="font-medium">{style.name}</span>
                  </div>
                </TableCell>

                <TableCell className="hidden max-w-[250px] truncate text-muted-foreground md:table-cell">
                  {style.description || "—"}
                </TableCell>

                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {style.created_at
                    ? new Date(style.created_at).toLocaleDateString()
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
