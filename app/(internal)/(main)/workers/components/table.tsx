"use client"

import { useRouter } from "next/navigation"
import { Users } from "lucide-react"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/DataTable"

import { getInitials } from "@/utils/utils"

interface Props {
  workers: GarmentWorker[]
}

export default function WorkersTable({ workers }: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Worker",
      render: (worker: GarmentWorker) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage
              src={worker?.photo_url}
              alt={worker?.name || "Worker"}
            />
            <AvatarFallback>
              {getInitials(worker?.name) || <Users className="size-4" />}
            </AvatarFallback>
          </Avatar>

          <span className="font-medium">{worker?.name || "Worker"}</span>
        </div>
      ),
    },
    {
      header: "Phone Number",
      className: "text-muted-foreground",
      render: (worker: GarmentWorker) => worker.phone || "—",
    },
    {
      header: "Gender",
      className: "hidden sm:table-cell",
      render: (worker: GarmentWorker) => (
        <Badge variant="outline" className="capitalize">
          {worker.gender}
        </Badge>
      ),
    },
  ]

  return (
    <DataTable
      data={workers}
      columns={columns}
      getRowId={(worker) => worker.id}
      onRowClick={(worker) => router.push(`/workers/${worker.id}`)}
      emptyMessage="No workers found."
    />
  )
}
