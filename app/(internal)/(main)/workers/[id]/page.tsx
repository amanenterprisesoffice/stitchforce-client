"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { useUser } from "@/contexts/UserContext"
import useFetch from "@/hooks/useFetch"
import Loader from "@/components/ui/Loader"
import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"
import { UserRoundXIcon } from "lucide-react"

import GarmentWorkerDetailsHeader from "./components/header"
import GarmentWorkerDetails from "./components/details"

import {
  GarmentWorker,
  UpdateGarmentWorkerPayload,
} from "@/utils/zodSchema/garmentWorker"
import EditGarmentWorkerDialog from "./components/edit-dialog"
import DeleteGarmentWorkerDialog from "./components/delete-dialog"
import WorkerStats from "./components/stats"
import WorkerQuickLinks from "./components/quicklinks"

export default function NewProductionEntriesPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useUser()

  const organizationID = user?.organization_id

  const url =
    organizationID && id
      ? `/api/organizations/${organizationID}/garment-workers/${id}`
      : ""

  const {
    data: worker,
    refetch: fetchWorker,
    isLoading,
  } = useFetch<GarmentWorker>({
    auto: true,
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

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    if (url) {
      fetchWorker({ url })
    }
  }, [url])

  const handleUpdate = async (values: UpdateGarmentWorkerPayload) => {
    if (!url) return

    await updateWorker({
      url,
      method: "PUT",
      payload: values,
      onSuccess: () => {
        setEditOpen(false)
        toast.success("Worker updated")
        fetchWorker({ url })
      },
    })
  }

  const handleStatusChange = async () => {
    if (!url || !worker) return

    const nextStatus = worker.status === "active" ? "inactive" : "active"

    await setWorkerStatus({
      url: `${url}/status`,
      method: "PATCH",
      payload: {
        status: nextStatus,
      },
      onSuccess: () => {
        toast.success(`Worker marked ${nextStatus}`)
        fetchWorker({ url })
      },
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
    })
  }

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Error"
        description="Something went wrong"
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
          <Button variant="outline" onClick={() => router.push("/workers")}>
            Back to workers
          </Button>
        }
      />
    )
  }

  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-5 p-4 md:p-6">
      <GarmentWorkerDetailsHeader
        worker={worker}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
        onStatusChange={handleStatusChange}
        isChangingStatus={isChangingStatus}
      />

      <div className="mx-auto h-fit w-full">
        <GarmentWorkerDetails worker={worker} />
      </div>
      <WorkerStats workerId={worker.id} />

      <WorkerQuickLinks worker={worker} />

      {/* Dialogs */}
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
    </main>
  )
}
