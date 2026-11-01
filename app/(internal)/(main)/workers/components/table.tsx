
"use client"

import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react"

import type { GarmentWorker } from "../../../../../utils/zodSchema/garmentWorker"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

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
  workers: GarmentWorker[]
  onEdit: (worker: GarmentWorker) => void
  onDelete: (worker: GarmentWorker) => void
}

const getInitials = (name: string) => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

export default function WorkersTable({
  workers,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Card className="w-full pt-0 shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>

              <TableHead>Phone Number</TableHead>

              <TableHead className="hidden sm:table-cell">
                Gender
              </TableHead>

              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {workers.map((worker) => (
              <TableRow key={worker.id}>

                {/* Worker */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      {worker.photo_url && (
                        <AvatarImage
                          src={worker.photo_url}
                          alt={worker.name}
                        />
                      )}

                      <AvatarFallback>
                        {getInitials(worker.name) || (
                          <Users className="size-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <span className="font-medium">
                      {worker.name}
                    </span>
                  </div>
                </TableCell>

                {/* Phone */}
                <TableCell className="text-muted-foreground">
                  {worker.phone || "—"}
                </TableCell>

                {/* Gender */}
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className="capitalize">
                    {worker.gender}
                  </Badge>
                </TableCell>

                {/* Actions */}
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
                      <span className="sr-only">
                        Open menu
                      </span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(worker)}
                      >
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(worker)}
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
