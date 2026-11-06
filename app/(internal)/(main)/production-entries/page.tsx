"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Scissors } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/Loader"
import State from "@/components/StateComponent"
import StateComponent from "@/components/StateComponent"
import Pagination from "@/components/ui/pagination"

import type { ProductionEntry } from "@/utils/zodSchema/production-entry"
import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import type { Bundle } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { StyleOperation } from "@/utils/zodSchema/styleops"

import { unwrapList } from "@/utils/utils"

import ProductionEntriesHeader from "./components/header"
import ProductionEntriesTable from "./components/table"
import ProductionEntryFilters from "./components/filters"
import DeleteProductionEntryDialog from "./components/delete-dialog"
import DebouncedSearch from "@/components/ui/debounced-search"

const DEFAULT_LIMIT = 25
const MAX_OPTION_LIMIT = 100

type FilterState = {
  search: string
  workerID: string
  styleID: string
  bundleID: string
  operationID: string
  fromDate: string
  toDate: string
}

const EMPTY_FILTERS: FilterState = {
  search: "",
  workerID: "",
  styleID: "",
  bundleID: "",
  operationID: "",
  fromDate: "",
  toDate: "",
}

function readInitialFilters(params: URLSearchParams): FilterState {
  return {
    search: params.get("search") || "",
    workerID: params.get("worker_id") || "",
    styleID: params.get("style_id") || "",
    bundleID: params.get("bundle_id") || "",
    operationID: params.get("style_operation_id") || "",
    fromDate: params.get("from_date") || "",
    toDate: params.get("to_date") || "",
  }
}

function buildQuery(
  filters: FilterState,
  limit: number,
  offset: number
) {
  const params = new URLSearchParams()

  if (filters.search.trim()) {
    params.set("search", filters.search.trim())
  }

  if (filters.workerID) params.set("worker_id", filters.workerID)
  if (filters.styleID) params.set("style_id", filters.styleID)
  if (filters.bundleID) params.set("bundle_id", filters.bundleID)

  if (filters.operationID) {
    params.set("style_operation_id", filters.operationID)
  }

  if (filters.fromDate) params.set("from_date", filters.fromDate)
  if (filters.toDate) params.set("to_date", filters.toDate)

  params.set("limit", String(limit))
  params.set("offset", String(offset))

  return params.toString()
}

function readTotal(response: unknown): number | undefined {
  if (!response || typeof response !== "object") return undefined

  const value = response as Record<string, any>

  const candidates = [
    value.total,
    value.total_count,
    value.count,
    value.pagination?.total,
    value.meta?.total,
    value.meta?.total_count,
  ]

  const total = candidates.find(
    (candidate) =>
      candidate !== null &&
      candidate !== undefined &&
      candidate !== "" &&
      Number.isFinite(Number(candidate))
  )

  return total === undefined ? undefined : Number(total)
}

export default function ProductionEntriesPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const searchParams = useSearchParams()

  const base = organizationID
    ? `/api/organizations/${organizationID}`
    : ""

  const entriesURL = `${base}/production-entries`

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)

  const [filtersInitialized, setFiltersInitialized] = useState(false)

  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(0)

  const [deleting, setDeleting] = useState<ProductionEntry | null>(null)

  // Initialize filters and pagination from URL.
  useEffect(() => {
    const initialFilters = readInitialFilters(
      new URLSearchParams(searchParams.toString())
    )

    setFilters(initialFilters)
    setDebouncedSearch(initialFilters.search)

    const initialLimit = Number(searchParams.get("limit"))
    const initialOffset = Number(searchParams.get("offset"))

    if (Number.isInteger(initialLimit) && initialLimit > 0) {
      setLimit(initialLimit)
    }

    if (Number.isInteger(initialOffset) && initialOffset >= 0) {
      setOffset(initialOffset)
    }

    setFiltersInitialized(true)
  }, [searchParams])

  // Debounce only search.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(filters.search.trim())
    }, 350)

    return () => window.clearTimeout(timer)
  }, [filters.search])

  // Update filters.
  const updateFilter = useCallback(
    <K extends keyof FilterState>(
      key: K,
      value: FilterState[K]
    ) => {
      setFilters((current) => {
        const next = {
          ...current,
          [key]: value,
        }

        // Reset dependent filters when style changes.
        if (key === "styleID") {
          next.bundleID = ""
          next.operationID = ""
        }

        return next
      })

      setOffset(0)
    },
    []
  )

  // Fetch production entries.
  const {
    data: entriesResponse,
    refetch: fetchEntries,
    isLoading: entriesLoading,
  } = useFetch<unknown>({ auto: false })

  // Fetch filter options.
  const {
    data: workersResponse,
    refetch: fetchWorkers,
    isLoading: workersLoading,
  } = useFetch<unknown>({ auto: false })

  const {
    data: stylesResponse,
    refetch: fetchStyles,
    isLoading: stylesLoading,
  } = useFetch<unknown>({ auto: false })

  const {
    data: bundlesResponse,
    refetch: fetchBundles,
    isLoading: bundlesLoading,
  } = useFetch<unknown>({ auto: false })

  const {
    data: operationsResponse,
    refetch: fetchOperations,
    isLoading: operationsLoading,
  } = useFetch<unknown>({ auto: false })

  // Delete mutation.
  const {
    refetch: mutateEntry,
    isLoading: isDeleting,
  } = useFetch({ auto: false })

  // Extract response data.
  const entries = useMemo(
    () =>
      unwrapList<ProductionEntry>(entriesResponse, [
        "production_entries",
        "entries",
      ]),
    [entriesResponse]
  )

  const workers = useMemo(
    () =>
      unwrapList<GarmentWorker>(workersResponse, [
        "workers",
        "garment_workers",
      ]),
    [workersResponse]
  )

  const styles = useMemo(
    () =>
      unwrapList<Style>(stylesResponse, ["styles"]),
    [stylesResponse]
  )

  const bundles = useMemo(
    () =>
      unwrapList<Bundle>(bundlesResponse, ["bundles"]).filter(
        (bundle) => !bundle.deleted_at
      ),
    [bundlesResponse]
  )

  const operations = useMemo(
    () =>
      unwrapList<StyleOperation>(operationsResponse, [
        "operations",
        "style_operations",
      ]),
    [operationsResponse]
  )

  // Filters used to determine empty state.
  const requestFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch]
  )

  // Build request URL.
  const requestURL = useMemo(() => {
    return `${entriesURL}?${buildQuery(
      {
        ...filters,
        search: debouncedSearch,
      },
      limit,
      offset
    )}`
  }, [
    entriesURL,
    filters.workerID,
    filters.styleID,
    filters.bundleID,
    filters.operationID,
    filters.fromDate,
    filters.toDate,
    debouncedSearch,
    limit,
    offset,
  ])

  // Load entries whenever filters or pagination change.
  const loadEntries = useCallback(() => {
    if (!organizationID || !filtersInitialized) return

    fetchEntries({
      url: requestURL,
      method: "GET",
      onError: (error: any) =>
        toast.error(
          error?.message || "Failed to load production entries"
        ),
    })
  }, [
    organizationID,
    filtersInitialized,
    fetchEntries,
    requestURL,
  ])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  // Load base filter options once.
  useEffect(() => {
    if (!organizationID) return

    fetchWorkers({
      url: `${base}/garment-workers?limit=${MAX_OPTION_LIMIT}&offset=0`,
      method: "GET",
      onError: (error: any) =>
        toast.error(error?.message || "Failed to load workers"),
    })

    fetchStyles({
      url: `${base}/styles?limit=${MAX_OPTION_LIMIT}&offset=0`,
      method: "GET",
      onError: (error: any) =>
        toast.error(error?.message || "Failed to load styles"),
    })
  }, [
    organizationID,
    base,
    fetchWorkers,
    fetchStyles,
  ])

  // Load dependent options when a style is selected.
  useEffect(() => {
    if (!organizationID || !filters.styleID) return

    fetchBundles({
      url: `${base}/bundles?style_id=${encodeURIComponent(
        filters.styleID
      )}&limit=${MAX_OPTION_LIMIT}&offset=0`,
      method: "GET",
      onError: (error: any) =>
        toast.error(
          error?.message || "Failed to load bundles for this style"
        ),
    })

    fetchOperations({
      url: `${base}/styles/${encodeURIComponent(
        filters.styleID
      )}/operations?limit=${MAX_OPTION_LIMIT}&offset=0`,
      method: "GET",
      onError: (error: any) =>
        toast.error(error?.message || "Failed to load style operations"),
    })
  }, [
    organizationID,
    base,
    filters.styleID,
    fetchBundles,
    fetchOperations,
  ])

  // Pagination.
  const totalItems = useMemo(
    () => readTotal(entriesResponse),
    [entriesResponse]
  )

  const hasNextPage =
    totalItems !== undefined
      ? offset + entries.length < totalItems
      : entries.length === limit

  // Delete entry.
  const deleteEntry = async () => {
    if (!deleting || !entriesURL) return

    await mutateEntry({
      url: `${entriesURL}/${deleting.id}`,
      method: "DELETE",

      onSuccess: () => {
        toast.success("Production entry deleted")
        setDeleting(null)

        // Move to previous page if the current page becomes empty.
        if (entries.length === 1 && offset > 0) {
          setOffset(Math.max(0, offset - limit))
        } else {
          loadEntries()
        }
      },

      onError: (error: any) =>
        toast.error(
          error?.message || "Failed to delete entry"
        ),
    })
  }

  // Clear all filters.
  const clearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setDebouncedSearch("")
    setOffset(0)
  }

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Organization unavailable"
        description="Your organization information could not be loaded."
      />
    )
  }

  const hasActiveFilters = Object.values(requestFilters).some(Boolean)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <ProductionEntriesHeader
        count={totalItems ?? entries.length}
      />

      <div className="flex h-full gap-4">
        <ProductionEntryFilters
          filters={filters}
          workers={workers}
          styles={styles}
          bundles={bundles}
          operations={operations}
          workersLoading={workersLoading}
          stylesLoading={stylesLoading}
          bundlesLoading={bundlesLoading}
          operationsLoading={operationsLoading}
          onChange={updateFilter}
          onClear={clearFilters}
        />

        <div className="relative flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden">


          <div className="min-h-0 flex-1">
            {entriesLoading && !entriesResponse ? (
              <Loader text="Loading production entries" />
            ) : !entries.length ? (
              <State
                message={
                  hasActiveFilters
                    ? "No entries found"
                    : "No production entries yet"
                }
                ICON={<Scissors />}
                description={
                  hasActiveFilters
                    ? "Try changing or clearing your filters."
                    : "Start recording completed work against a bundle, operation, and worker."
                }
                PortalButton={
                  !hasActiveFilters ? (
                    <Button
                      render={
                        <Link href="/production-entries/new" />
                      }
                    >
                      Create first entry
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <ProductionEntriesTable entries={entries} />
            )}
          </div>

          {(entries.length > 0 || offset > 0) && (
            <Pagination
              limit={limit}
              offset={offset}
              itemCount={entries.length}
              totalItems={totalItems}
              hasNextPage={hasNextPage}
              onPageChange={setOffset}
              onLimitChange={(nextLimit) => {
                setLimit(nextLimit)
                setOffset(0)
              }}
            />
          )}
        </div>
      </div>

      <DeleteProductionEntryDialog
        entry={deleting}
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        onDelete={deleteEntry}
        isDeleting={isDeleting}
      />
    </div>
  )
}