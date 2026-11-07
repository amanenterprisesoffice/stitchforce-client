"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { formatDate, getInitials } from "@/utils/utils"
import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  worker: GarmentWorker
}

function displayGender(gender?: string) {
  if (!gender) return "—"
  return gender.charAt(0).toUpperCase() + gender.slice(1)
}

export default function GarmentWorkerDetails({ worker }: Props) {
  return (
    <Card className="w-full min-w-0">
      <CardHeader>
        <CardTitle className="text-base">Worker information</CardTitle>
        <CardDescription>
          Detailed information about the worker
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full min-w-0">
        <div className="flex w-full min-w-0 flex-col gap-6 sm:flex-row">
          {worker.photo_url && (
            <Avatar className="size-24 shrink-0 sm:size-32">
              <AvatarImage
                src={worker.photo_url}
                alt={worker.name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-semibold">
                {getInitials(worker.name)}
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={`grid w-full min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-3 ${
              worker.photo_url
                ? "sm:border-l sm:pl-6"
                : ""
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="mt-1 break-words font-medium">
                {worker.phone || "—"}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="mt-1 font-medium">
                {displayGender(worker.gender)}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="mt-1 font-medium capitalize">
                {worker.status || "—"}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Worker ID</p>
              <p className="mt-1 break-all font-mono text-xs">
                {worker.id}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Created at</p>
              <p className="mt-1 font-medium">
                {formatDate(worker.created_at)}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Last updated</p>
              <p className="mt-1 font-medium">
                {formatDate(worker.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}