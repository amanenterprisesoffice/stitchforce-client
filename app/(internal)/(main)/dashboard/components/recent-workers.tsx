"use client"

import { useRouter } from "next/navigation"
import { ArrowUpRight, Phone, UserRound } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/DataTable"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  formatDate,
  getInitials,
} from "@/utils/utils"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"

interface Props {
  workers: GarmentWorker[]
  isLoading: boolean
}

export default function RecentWorkers({
  workers,
  isLoading,
}: Props) {
  const router = useRouter()

  const columns = [
    {
      header: "Worker",
      render: (worker: GarmentWorker) => (
        <div className="flex min-w-[170px] items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage
              src={worker.photo_url || undefined}
              alt={worker.name}
            />
            <AvatarFallback>
              {getInitials(worker.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate font-medium">{worker.name}</p>
            <p className="text-xs capitalize text-muted-foreground">
              {worker.gender || "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Phone",
      render: (worker: GarmentWorker) => (
        <span className="flex items-center gap-2 whitespace-nowrap text-sm text-muted-foreground">
          <Phone className="size-3.5" />
          {worker.phone || "—"}
        </span>
      ),
    },
    {
      header: "Joined",
      className: "whitespace-nowrap",
      render: (worker: GarmentWorker) =>
        formatDate(worker.created_at),
    },
    {
      header: "Status",
      render: (worker: GarmentWorker) => (
        <Badge
          variant={
            worker.status === "active"
              ? "default"
              : "secondary"
          }
          className="capitalize"
        >
          {worker.status}
        </Badge>
      ),
    },
  ]

  return (
    <Card className="shadow-sm pb-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-lg">
          Recent workers
        </CardTitle>

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
          data={workers}
          columns={columns}
          getRowId={(worker) => worker.id}
          onRowClick={(worker) =>
            router.push(`/workers/${worker.id}`)
          }
          emptyMessage="No workers found."
          className="rounded-none"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  )
}