"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Search, Scissors, Plus } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Loader from "@/components/ui/Loader"
import State from "@/components/StateComponent"

import type { ProductionEntry } from "@/utils/zodSchema/production-entry"
import {
  unwrapList,
} from "@/lib/utils"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import type { Bundle } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { StyleOperation } from "@/utils/zodSchema/styleops"

import ProductionEntriesHeader from "./components/header"
import ProductionEntriesTable from "./components/table"
import ProductionEntryFilters from "./components/filters"
import DeleteProductionEntryDialog from "./components/delete-dialog"
import StateComponent from "@/components/StateComponent"

export default function ProductionEntriesPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const baseURL = organizationID
    ? `/api/organizations/${organizationID}/production-entries`
    : ""

  const [search, setSearch] = useState("")

  const [workerFilter, setWorkerFilter] = useState("all")
  const [bundleFilter, setBundleFilter] = useState("all")
  const [operationFilter, setOperationFilter] = useState("all")

  const [viewing, setViewing] = useState<ProductionEntry | null>(null)
  const [editing, setEditing] = useState<ProductionEntry | null>(null)
  const [deleting, setDeleting] = useState<ProductionEntry | null>(null)

  const [entries, setEntries] = useState<ProductionEntry[]>([])
  const [workers, setWorkers] = useState<GarmentWorker[]>([])
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [styles, setStyles] = useState<Style[]>([])

  const [operationsByStyle, setOperationsByStyle] = useState<
    Record<string, StyleOperation[]>
  >({})

  // Fetch production entries
  const {
    refetch: fetchEntries,
    isLoading: entriesLoading,
  } = useFetch({
    auto: false,
    onSuccess: (response: any) => {
      setEntries(
        unwrapList<ProductionEntry>(response, [
          "production_entries",
          "entries",
        ])
      )
    },
  })

  // Fetch workers
  const { refetch: fetchWorkers } = useFetch({
    auto: false,
    onSuccess: (response: any) => {
      setWorkers(
        unwrapList<GarmentWorker>(response, [
          "workers",
          "garment_workers",
        ])
      )
    },
  })

  // Fetch bundles
  const { refetch: fetchBundles } = useFetch({
    auto: false,
    onSuccess: (response: any) => {
      setBundles(
        unwrapList<Bundle>(response, ["bundles"]).filter(
          (bundle) => !bundle.deleted_at
        )
      )
    },
  })

  // Fetch styles
  const { refetch: fetchStyles } = useFetch({
    auto: false,
    onSuccess: (response: any) => {
      setStyles(unwrapList<Style>(response, ["styles"]))
    },
  })

  // Fetch operations
  const { refetch: fetchOperations } = useFetch({
    auto: false,
  })

  // Create, update and delete
  const {
    refetch: mutateEntry,
    isLoading: isSaving,
  } = useFetch({
    auto: false,
  })

  const loadEntries = () => {
    if (!baseURL) return

    fetchEntries({
      url: baseURL,
      method: "GET",
      onError: (error: any) => {
        toast.error(
          error?.message || "Failed to load production entries"
        )
      },
    })
  }

  // Initial data loading
  useEffect(() => {
    if (!organizationID) return

    fetchEntries({
      url: baseURL,
      method: "GET",
      onError: (error: any) => {
        toast.error(
          error?.message || "Failed to load production entries"
        )
      },
    })

    fetchWorkers({
      url: `/api/organizations/${organizationID}/garment-workers`,
      method: "GET",
      onError: (error: any) => {
        toast.error(error?.message || "Failed to load workers")
      },
    })

    fetchBundles({
      url: `/api/organizations/${organizationID}/bundles`,
      method: "GET",
      onError: (error: any) => {
        toast.error(error?.message || "Failed to load bundles")
      },
    })

    fetchStyles({
      url: `/api/organizations/${organizationID}/styles`,
      method: "GET",
      onError: (error: any) => {
        toast.error(error?.message || "Failed to load styles")
      },
    })
  }, [organizationID])

  // Fetch operations for each style (used by filters)
  useEffect(() => {
    if (!organizationID || !styles.length) return

    styles.forEach((style) => {
      if (operationsByStyle[style.id]) return

      fetchOperations({
        url: `/api/organizations/${organizationID}/styles/${style.id}/operations`,
        method: "GET",
        onSuccess: (response: any) => {
          const operations = unwrapList<StyleOperation>(response, [
            "operations",
          ])

          setOperationsByStyle((previous) => ({
            ...previous,
            [style.id]: operations,
          }))
        },
        onError: () => undefined,
      })
    })
  }, [organizationID, styles, operationsByStyle])

  const operations = useMemo(
    () => Object.values(operationsByStyle).flat(),
    [operationsByStyle]
  )

  // Search and filters use nested entry objects directly
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return entries.filter((entry) => {
      const matchesSearch =
        !query ||
        [
          entry.worker?.name,
          entry.worker?.phone,
          entry.bundle?.bundle_number,
          entry.style?.name,
          entry.style?.style_number,
          entry.operation?.name,
          entry.remarks,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        )

      return (
        matchesSearch &&
        (workerFilter === "all" ||
          entry.worker_id === workerFilter) &&
        (bundleFilter === "all" ||
          entry.bundle_id === bundleFilter) &&
        (operationFilter === "all" ||
          entry.style_operation_id === operationFilter)
      )
    })
  }, [
    entries,
    search,
    workerFilter,
    bundleFilter,
    operationFilter,
  ])


  // Delete entry
  const deleteEntry = async () => {
    if (!deleting || !baseURL) return

    await mutateEntry({
      url: `${baseURL}/${deleting.id}`,
      method: "DELETE",
      onSuccess: () => {
        toast.success("Production entry deleted")
        setDeleting(null)
        loadEntries()
      },
      onError: (error: any) => {
        toast.error(
          error?.message || "Failed to delete entry"
        )
      },
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

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <ProductionEntriesHeader count={entries.length} />

      {/* Search and create */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder="Search worker, bundle, style, operation..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <Button render={<Link href="/production-entries/new" />}>
          <Plus className="size-4" />
          Add production entries
        </Button>
      </div>

      {/* Filters */}
      <ProductionEntryFilters
        workers={workers}
        bundles={bundles}
        entries={entries}
        operations={operations}
        workerFilter={workerFilter}
        bundleFilter={bundleFilter}
        operationFilter={operationFilter}
        onWorkerChange={setWorkerFilter}
        onBundleChange={setBundleFilter}
        onOperationChange={setOperationFilter}
        onClear={() => {
          setWorkerFilter("all")
          setBundleFilter("all")
          setOperationFilter("all")
          setSearch("")
        }}
      />

      {/* Table */}
      <div className="min-h-0 flex-1">
        {entriesLoading && !entries.length ? (
          <Loader text="Loading production entries" />
        ) : !entries.length ? (
          <State
            message="No production entries yet"
            ICON={<Scissors />}
            description="Start recording completed work against a bundle, operation, and worker."
            PortalButton={
              <Button render={<Link href="/production-entries/new" />}>
                Create first entry
              </Button>
            }
          />
        ) : !filtered.length ? (
          <State
            message="No entries found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <ProductionEntriesTable
            entries={filtered}
            onView={setViewing}
          />
        )}
      </div>


      {/* Delete */}
      <DeleteProductionEntryDialog
        entry={deleting}
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        onDelete={deleteEntry}
        isDeleting={isSaving}
      />
    </div>
  )
}