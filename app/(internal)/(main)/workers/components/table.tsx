"use client"
import { useRouter } from "next/navigation"

import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react"

import type { GarmentWorker } from "../../../../../utils/zodSchema/garmentWorker"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
import { getInitials } from "@/lib/utils"

interface Props {
  workers: GarmentWorker[]
}

export default function WorkersTable({ workers }: Props) {
  const router = useRouter()
  return (
    <Card className="w-full pt-0 shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>

              <TableHead>Phone Number</TableHead>

              <TableHead className="hidden sm:table-cell">Gender</TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>
            {workers.map((worker) => (
              <TableRow
                key={worker.id}
                className="cursor-pointer"
                onClick={() => router.push(`/workers/${worker.id}`)}
              >
                {/* Worker */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      {worker.photo_url && (
                        <AvatarImage src={worker.photo_url} alt={worker.name} />
                      )}

                      <AvatarFallback>
                        {getInitials(worker.name) || (
                          <Users className="size-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <span className="font-medium">{worker.name}</span>
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

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
