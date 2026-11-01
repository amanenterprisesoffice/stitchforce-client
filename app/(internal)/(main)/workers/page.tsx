"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import State from "@/components/StateComponent"

import WorkersHeader from "./components/header"
import WorkersTable from "./components/table"
import WorkerFormDialog from "./components/form-dialog"

import type {
  GarmentWorker,
  GarmentWorkerFormValues,
} from "../../../../utils/zodSchema/garmentWorker"

import { Search, Users2 } from "lucide-react"
import DeleteWorkerDialog from "./components/delete-worker-dialog"

export default function GarmentWorkersPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [editingWorker, setEditingWorker] = useState<GarmentWorker | null>(null)

  const [deletingWorker, setDeletingWorker] = useState<GarmentWorker | null>(
    null
  )

  const workersURL = organizationID
    ? `/api/organizations/${organizationID}/garment-workers`
    : ""

  // GET workers
  const {
    data: workersData,
    isLoading,
    refetch: fetchWorkers,
  } = useFetch({
    url: workersURL,
    method: "GET",
  })

  // POST, PUT and DELETE
  const { isLoading: isSaving, refetch: mutateWorker } = useFetch()

  const workers: GarmentWorker[] = Array.isArray(workersData)
    ? workersData
    : (workersData?.workers ?? [])

  // Fetch when organization becomes available
  useEffect(() => {
    if (!organizationID) return

    fetchWorkers({
      url: `/api/organizations/${organizationID}/garment-workers`,
      method: "GET",
      onError: (error: any) => {
        toast.error(error?.message || "Failed to fetch workers")
      },
    })
  }, [organizationID, fetchWorkers])

  // Search
  const filteredWorkers = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return workers

    return workers.filter(
      (worker) =>
        worker.name?.toLowerCase().includes(query) ||
        worker.phone?.toLowerCase().includes(query) ||
        worker.gender?.toLowerCase().includes(query)
    )
  }, [workers, search])

  // Create
  const openCreateDialog = () => {
    setEditingWorker(null)
    setDialogOpen(true)
  }

  // Edit
  const openEditDialog = (worker: GarmentWorker) => {
    setEditingWorker(worker)
    setDialogOpen(true)
  }

  // Save (POST / PUT)
  const handleSave = async (values: GarmentWorkerFormValues) => {
    if (!organizationID) {
      toast.error("Organization not found")
      return
    }

    const isEditing = !!editingWorker

    const formData = new FormData()

    formData.append("name", values.name.trim())
    formData.append("phone", values.phone.trim())
    formData.append("gender", values.gender)

    // Profile photo (optional)
    if (values.photo?.[0]) {
      formData.append("photo", values.photo[0])
    }

    await mutateWorker({
      url: isEditing
        ? `/api/organizations/${organizationID}/garment-workers/${editingWorker.id}`
        : `/api/organizations/${organizationID}/garment-workers`,

      method: isEditing ? "PUT" : "POST",

      payload: formData,
      onSuccess: () => {
        toast.success(
          isEditing
            ? "Worker updated successfully"
            : "Worker created successfully"
        )

        setDialogOpen(false)
        setEditingWorker(null)

        fetchWorkers({
          url: `/api/organizations/${organizationID}/garment-workers`,
          method: "GET",
        })
      },

      onError: (error: any) => {
        toast.error(error?.message || "Failed to save worker")
      },
    })
  }

  // Delete
  const handleDelete = async () => {
    if (!deletingWorker || !organizationID) return

    await mutateWorker({
      url: `/api/organizations/${organizationID}/garment-workers/${deletingWorker.id}`,
      method: "DELETE",

      onSuccess: () => {
        toast.success("Worker deleted successfully")

        setDeleteDialogOpen(false)
        setDeletingWorker(null)

        fetchWorkers({
          url: `/api/organizations/${organizationID}/garment-workers`,
          method: "GET",
        })
      },

      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete worker")
      },
    })
  }

  if (!organizationID) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Organization information is unavailable.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <WorkersHeader count={workers.length} onCreate={openCreateDialog} />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search workers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="relative flex flex-1">
        {/* Loading */}
        {isLoading && !workersData ? (
          <Loader text="Loading workers" />
        ) : workers.length === 0 ? (
          <State
            message="No workers yet"
            description="Get started by adding your first garment worker. You can manage their contact information and gender."
            ICON={<Users2 />} // Replace SomeIcon with the appropriate icon component you want to use
            PortalButton={
              <Button variant="outline" onClick={openCreateDialog}>
                Add your first worker
              </Button>
            }
          />
        ) : filteredWorkers.length === 0 ? (
          <State
            message="No workers found"
            description="Try searching with a different name, phone number or gender."
            PortalButton={
              <Button variant="outline" onClick={() => setSearch("")}>
                Clear search
              </Button>
            }
          />
        ) : (
          <WorkersTable
            workers={filteredWorkers}
            onEdit={openEditDialog}
            onDelete={(worker) => {
              setDeletingWorker(worker)
              setDeleteDialogOpen(true)
            }}
          />
        )}
      </div>

      {/* Create / Edit */}
      <WorkerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingWorker={editingWorker}
        onSubmit={handleSave}
        isSaving={isSaving}
      />

      {/* Delete */}
      <DeleteWorkerDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        worker={deletingWorker}
        onDelete={handleDelete}
        isDeleting={isSaving}
        onCancel={() => setDeletingWorker(null)}
      />
    </div>
  )
}
