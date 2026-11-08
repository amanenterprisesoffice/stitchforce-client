"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Users2 } from "lucide-react"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import { Button } from "@/components/ui/button"
import State from "@/components/StateComponent"
import StateComponent from "@/components/StateComponent"
import Pagination from "@/components/ui/pagination"

import WorkersHeader from "./components/header"
import WorkersTable from "./components/table"
import WorkerFormDialog from "./components/form-dialog"
import WorkerFilters from "./components/filters"

import type {
  GarmentWorker,
  GarmentWorkerFormValues,
} from "../../../../utils/zodSchema/garmentWorker"

const DEFAULT_LIMIT = 25

export default function GarmentWorkersPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(0)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWorker, setEditingWorker] =
    useState<GarmentWorker | null>(null)

  const workersURL = organizationID
    ? `/api/organizations/${organizationID}/garment-workers`
    : ""

  const requestURL = useMemo(() => {
    const params = new URLSearchParams()

    if (search.trim()) {
      params.set("search", search.trim())
    }

    if (status) {
      params.set("status", status)
    }

    params.set("limit", String(limit))
    params.set("offset", String(offset))

    return `${workersURL}?${params.toString()}`
  }, [workersURL, search, status, limit, offset])

  // Fetch workers
  const {
    data: workersData,
    isLoading,
    refetch: fetchWorkers,
  } = useFetch<any>({
    auto: false,
  })

  // POST, PUT and DELETE
  const {
    isLoading: isSaving,
    refetch: mutateWorker,
  } = useFetch()

  // Normalize workers
  const workers: GarmentWorker[] = Array.isArray(workersData)
    ? workersData
    : workersData?.workers ?? []

  // Total count
  const totalItems = useMemo(() => {
    if (!workersData || typeof workersData !== "object") {
      return undefined
    }

    const data = workersData as Record<string, any>

    const candidates = [
      data.total,
      data.total_count,
      data.count,
      data.pagination?.total,
      data.meta?.total,
      data.meta?.total_count,
    ]

    const total = candidates.find(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        Number.isFinite(Number(value))
    )

    return total === undefined ? undefined : Number(total)
  }, [workersData])

  const hasNextPage =
    totalItems !== undefined
      ? offset + workers.length < totalItems
      : workers.length === limit

  // Fetch whenever query changes
  const loadWorkers = useCallback(() => {
    if (!organizationID) return

    fetchWorkers({
      url: requestURL,
    })
  }, [organizationID, requestURL, fetchWorkers])

  useEffect(() => {
    loadWorkers()
  }, [loadWorkers])

  // Search
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setOffset(0)
  }, [])

  // Status
  const handleStatusChange = useCallback((value: string) => {
    setStatus(value)
    setOffset(0)
  }, [])

  // Create
  const openCreateDialog = () => {
    setEditingWorker(null)
    setDialogOpen(true)
  }

  // Save
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

    if (values.photo?.[0]) {
      formData.append("photo", values.photo[0])
    }

    await mutateWorker({
      url: isEditing
        ? `${workersURL}/${editingWorker.id}`
        : workersURL,

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

        loadWorkers()
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

  const isEmptyPage = workers.length === 0 && offset > 0
  const hasActiveFilters = !!search.trim() || !!status

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <WorkersHeader
        count={totalItems ?? workers.length}
        onCreate={openCreateDialog}
      />

      {/* Filters */}
      <WorkerFilters
        search={search}
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
      />

      <div className="relative flex flex-1 flex-col">
        {isLoading && !workersData ? (
          <Loader text="Loading workers" />
        ) : isEmptyPage ? (
          <State
            message="No more workers on this page"
            description="There are no workers available on this page."
            ICON={<Users2 />}
            PortalButton={
              <Button
                variant="outline"
                onClick={() => setOffset(0)}
              >
                Go to first page
              </Button>
            }
          />
        ) : workers.length === 0 ? (
          <State
            message={
              hasActiveFilters
                ? "No workers found"
                : "No workers yet"
            }
            description={
              hasActiveFilters
                ? "Try changing your search or status filter."
                : "Get started by adding your first garment worker. You can manage their contact information and gender."
            }
            ICON={<Users2 />}
            PortalButton={
              hasActiveFilters ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("")
                    setStatus("")
                    setOffset(0)
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={openCreateDialog}
                >
                  Add your first worker
                </Button>
              )
            }
          />
        ) : (
          <WorkersTable workers={workers} />
        )}
      </div>

      {/* Pagination */}
      {(workers.length > 0 || offset > 0) && (
        <Pagination
          limit={limit}
          offset={offset}
          itemCount={workers.length}
          totalItems={totalItems}
          hasNextPage={hasNextPage}
          onPageChange={setOffset}
          onLimitChange={(nextLimit) => {
            setLimit(nextLimit)
            setOffset(0)
          }}
        />
      )}

      {/* Create / Edit */}
      <WorkerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingWorker={editingWorker}
        onSubmit={handleSave}
        isSaving={isSaving}
      />
    </div>
  )
}