"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ClipboardList,
  Pencil,
  Trash2,
  UserRound,
  UserRoundXIcon,
} from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"
import Loader from "@/components/ui/Loader"
import State from "@/components/StateComponent"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { getInitials, formatDate } from "@/utils/utils"

import EditGarmentWorkerDialog from "./components/edit-dialog"
import DeleteGarmentWorkerDialog from "./components/delete-dialog"
import StateComponent from "@/components/StateComponent"

export interface GarmentWorker {
  id: string
  organization_id: string
  name: string
  phone: string
  gender: "male" | "female" | "other" | string
  photo_url?: string | null
  status: "active" | "inactive"
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface UpdateGarmentWorkerPayload {
  name: string
  phone: string
  gender: "male" | "female" | "other"
}

function unwrapWorker(result: any): GarmentWorker | null {
  const value =
    result?.garment_worker ?? result?.worker ?? result?.data ?? result
  return value && typeof value === "object" && value.id
    ? (value as GarmentWorker)
    : null
}

function displayGender(gender?: string) {
  if (!gender) return "—"
  return gender.charAt(0).toUpperCase() + gender.slice(1)
}

export default function GarmentWorkerDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useUser()
  const organizationID = user?.organization_id

  const [worker, setWorker] = useState<GarmentWorker | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const url =
    organizationID && id
      ? `/api/organizations/${organizationID}/garment-workers/${id}`
      : ""

  const { refetch: fetchWorker, isLoading } = useFetch({
    auto: false,
    onSuccess: (result: any) => {
      const data = unwrapWorker(result)
      if (data) setWorker(data)
      else toast.error("Worker not found")
    },
    onError: (error: any) =>
      toast.error(error?.message || "Failed to load worker"),
  })
  const { refetch: updateWorker, isLoading: isSaving } = useFetch({
    auto: false,
  })
  const { refetch: setWorkerStatus, isLoading: isChangingStatus } = useFetch({
    auto: false,
  })
  const { refetch: deleteWorker, isLoading: isDeleting } = useFetch({
    auto: false,
  })

  const loadWorker = useCallback(() => {
    if (url) fetchWorker({ url, method: "GET" })
  }, [url, fetchWorker])

  useEffect(() => {
    loadWorker()
  }, [loadWorker])

  const handleUpdate = async (values: UpdateGarmentWorkerPayload) => {
    if (!url) return
    await updateWorker({
      url,
      method: "PUT",
      payload: values,
      onSuccess: () => {
        setEditOpen(false)
        toast.success("Worker updated")
        loadWorker()
      },
      onError: (error: any) =>
        toast.error(error?.message || "Failed to update worker"),
    })
  }

  const handleStatusChange = async () => {
    if (!url || !worker) return
    const nextStatus = worker.status === "active" ? "inactive" : "active"
    await setWorkerStatus({
      url: `${url}/status`,
      method: "PATCH",
      payload: { status: nextStatus },
      onSuccess: () => {
        toast.success(`Worker marked ${nextStatus}`)
        loadWorker()
      },
      onError: (error: any) =>
        toast.error(error?.message || "Failed to update status"),
    })
  }

  const handleDelete = async () => {
    if (!url) return
    await deleteWorker({
      url,
      method: "DELETE",
      onSuccess: () => {
        toast.success("Worker deleted")
        router.push("/workers")
      },
      onError: (error: any) =>
        toast.error(error?.message || "Failed to delete worker"),
    })
  }

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Error"
        description="Something went wrong "
      />
    )
  }

  if (isLoading && !worker) {
    return <Loader text="Loading worker" />
  }

  if (!worker) {
    return (
      <StateComponent
        className="rounded-none"
        ICON={<UserRoundXIcon className="size-6" />}
        message="Worker not found"
        description="This worker may have been deleted or not accessible."
        PortalButton={
          <Button variant="outline" render={<Link href="/workers" />}>
            Back to workers
          </Button>
        }
      />
    )
  }

  const entriesHref = `/production-entries?worker_id=${encodeURIComponent(worker.id)}`

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center gap-5 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarImage
                src={worker.photo_url || undefined}
                alt={worker.name}
              />
              <AvatarFallback className="text-lg">
                {getInitials(worker.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {worker.name}
                </h1>
                <Badge
                  variant={worker.status === "active" ? "default" : "secondary"}
                >
                  {worker.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {worker.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 size-4" /> Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleStatusChange}
            disabled={isChangingStatus}
          >
            {isChangingStatus
              ? "Updating..."
              : worker.status === "active"
                ? "Deactivate"
                : "Activate"}
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 size-4" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Worker information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="mt-1 font-medium">{worker.phone || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="mt-1 font-medium">{displayGender(worker.gender)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="mt-1 font-medium capitalize">{worker.status}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Worker ID</p>
            <p className="mt-1 font-mono text-xs break-all">{worker.id}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full justify-start"
            variant="outline"
            render={<Link href={entriesHref} />}
          >
            <ClipboardList className="mr-2 size-4" />
            View production entries
          </Button>
          <p className="text-xs text-muted-foreground">
            Opens the production entries page filtered by this worker.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <UserRound className="size-3.5" />
        <span>Created {formatDate(worker.created_at)}</span>
        <Separator orientation="vertical" className="h-3" />
        <span>Updated {formatDate(worker.updated_at)}</span>
      </div>

      <EditGarmentWorkerDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        worker={worker}
        onSubmit={handleUpdate}
        isSaving={isSaving}
      />
      <DeleteGarmentWorkerDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        workerName={worker.name}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
