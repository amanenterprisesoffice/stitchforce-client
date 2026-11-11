"use client"

import { useRouter } from "next/navigation"
import { ArrowUpRight, Phone, UserRound } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/DataTable"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { formatDate, getInitials, prettifyKey } from "@/utils/utils"

import type { GarmentWorker } from "@/utils/types/garmentWorker"
import { WorkerInfo } from "@/components/ui/worker-avatar"

interface Props {
  workers: GarmentWorker[] | null
  isLoading: boolean
}

export default function RecentWorkers({ workers, isLoading }: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Worker",
      render: (worker: GarmentWorker) => (
        <WorkerInfo worker={worker}  />
      ),
    },
    {
      header: "Gender",
      className: "whitespace-nowrap",
      render: (worker: GarmentWorker) => prettifyKey(worker.gender),
    },
    {
      header: "Status",
      render: (worker: GarmentWorker) => (
        <Badge
          variant={worker.status === "active" ? "default" : "secondary"}
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
    <Card className="pb-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-lg">Recent workers</CardTitle>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => router.push("/workers")}
        >
          View all
          <ArrowUpRight className="ml-1 size-4" />
        </Button>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <DataTable
          data={workers ?? []}
          columns={columns}
          getRowId={(worker) => worker?.id ?? ""}
          onRowClick={(worker) => router.push(`/workers/${worker?.id}`)}
          emptyMessage="No workers found."
          className="rounded-none"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  )
}
