"use client"

import { useRouter } from "next/navigation"
import { Users } from "lucide-react"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/DataTable"

import { formatDate, getInitials, prettifyKey } from "@/utils/utils"
import { WorkerInfo } from "@/components/ui/worker-avatar"

interface Props {
  workers: GarmentWorker[]
}

export default function WorkersTable({ workers }: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Worker",
      render: (worker: GarmentWorker) => (
        <WorkerInfo worker={worker} ignoreFields={["phone"]} />
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
      render: (worker: GarmentWorker) => prettifyKey(worker.gender),
    },
    {
      header: "Status",
      className: "hidden sm:table-cell",
      render: (worker: GarmentWorker) => (
        <Badge
          variant={worker?.status === "active" ? "default" : "outline"}
          className="capitalize"
        >
          {worker.status}
        </Badge>
      ),
    },
    {
      header: "Joined",
      className: "whitespace-nowrap text-right",
      render: (worker: GarmentWorker) => formatDate(worker.created_at),
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
