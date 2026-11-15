"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, Users } from "lucide-react"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"

import type { GarmentWorker } from "@/utils/types/garmentWorker"
import type { Bundle } from "@/utils/types/bundle"
import type { Style } from "@/utils/types/style"
import type { StyleOperation } from "@/utils/types/styleops"

import { unwrapList } from "@/utils/utils"

import WorkerPaymentsTable, {
  type WorkerPaymentBalance,
} from "./components/table"
import WorkerPaymentFilters, {
  type WorkerPaymentFiltersValue,
} from "./components/filters"
import WorkerPaymentSummary, {
  type WorkerPaymentSummaryData,
} from "./components/summary"
import PendingPaymentsHeader from "./components/header"

const DEFAULT_LIMIT = 10
const MAX_OPTION_LIMIT = 1000

const EMPTY_FILTERS: WorkerPaymentFiltersValue = {
  search: "",
  workerID: "",
  styleID: "",
  bundleID: "",
  operationID: "",
  fromDate: "",
  toDate: "",
}

const EMPTY_SUMMARY: WorkerPaymentSummaryData = {
  total_earned: 0,
  total_paid: 0,
  total_pending: 0,
  pending_entries: 0,
  total_workers: 0,
}

interface WorkerPaymentBalanceResponse {
  summary?: Partial<WorkerPaymentSummaryData>
  workers?: WorkerPaymentBalance[]
  balances?: WorkerPaymentBalance[]
  data?: WorkerPaymentBalance[]
}

function readInitialFilters(
  params: URLSearchParams
): WorkerPaymentFiltersValue {
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

function unwrapBalances(
  response: WorkerPaymentBalanceResponse | null | undefined
): WorkerPaymentBalance[] {
  if (!response) return []

  if (Array.isArray(response.workers)) return response.workers
  if (Array.isArray(response.balances)) return response.balances
  if (Array.isArray(response.data)) return response.data

  return []
}

function buildQuery(
  filters: WorkerPaymentFiltersValue,
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

export default function WorkerPaymentsPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const searchParams = useSearchParams()

  const base = organizationID ? `/api/organizations/${organizationID}` : ""
  const balancesURL = `${base}/worker-payments/balances`

  const [filters, setFilters] =
    useState<WorkerPaymentFiltersValue>(EMPTY_FILTERS)

  const [filtersInitialized, setFiltersInitialized] = useState(false)

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(0)

  // Initialize filters and pagination from URL.
  useEffect(() => {
    const initialFilters = readInitialFilters(
      new URLSearchParams(searchParams.toString())
    )

    setFilters(initialFilters)

    const initialLimit = Number(searchParams.get("limit"))
    const initialOffset = Number(searchParams.get("offset"))

    setLimit(
      Number.isInteger(initialLimit) && initialLimit > 0
        ? initialLimit
        : DEFAULT_LIMIT
    )

    setOffset(
      Number.isInteger(initialOffset) && initialOffset >= 0 ? initialOffset : 0
    )

    setFiltersInitialized(true)
  }, [searchParams])

  const requestURL = useMemo(() => {
    if (!organizationID || !filtersInitialized) return ""

    return `${balancesURL}?${buildQuery(filters, limit, offset)}`
  }, [organizationID, filtersInitialized, balancesURL, filters, limit, offset])

  // Fetch worker balances.
  const {
    data: balancesResponse,
    isLoading,
    refetch: fetchBalances,
    error: balancesError,
  } = useFetch<WorkerPaymentBalanceResponse>({
    auto: false,
  })

  // Fetch filter options.
  const {
    data: workersResponse,
    refetch: fetchWorkers,
    isLoading: workersLoading,
    error: workersError,
  } = useFetch<unknown>({ auto: false })

  const {
    data: stylesResponse,
    refetch: fetchStyles,
    isLoading: stylesLoading,
    error: stylesError,
  } = useFetch<unknown>({ auto: false })

  const {
    data: bundlesResponse,
    refetch: fetchBundles,
    isLoading: bundlesLoading,
    error: bundlesError,
  } = useFetch<unknown>({ auto: false })

  const {
    data: operationsResponse,
    refetch: fetchOperations,
    isLoading: operationsLoading,
    error: operationsError,
  } = useFetch<unknown>({ auto: false })

  // Extract filter options.
  const workers = useMemo(
    () =>
      unwrapList<GarmentWorker>(workersResponse, [
        "workers",
        "garment_workers",
      ]),
    [workersResponse]
  )

  const styles = useMemo(
    () => unwrapList<Style>(stylesResponse, ["styles"]),
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

  // Extract balances and summary.
  const balances = useMemo(
    () => unwrapBalances(balancesResponse),
    [balancesResponse]
  )

  const summary = useMemo<WorkerPaymentSummaryData>(
    () => ({
      ...EMPTY_SUMMARY,
      ...(balancesResponse?.summary ?? {}),
    }),
    [balancesResponse]
  )

  // Update filters.
  const updateFilter = useCallback(
    <K extends keyof WorkerPaymentFiltersValue>(
      key: K,
      value: WorkerPaymentFiltersValue[K]
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

  // Fetch initial filter options.
  useEffect(() => {
    if (!organizationID) return

    fetchWorkers({
      url: `${base}/garment-workers?limit=${MAX_OPTION_LIMIT}&offset=0`,
    })

    fetchStyles({
      url: `${base}/styles?limit=${MAX_OPTION_LIMIT}&offset=0`,
    })
  }, [organizationID, base, fetchWorkers, fetchStyles])

  // Fetch balances whenever filters or pagination change.
  useEffect(() => {
    if (!organizationID || !requestURL) return

    fetchBalances({
      url: requestURL,
      method: "GET",
    })
  }, [organizationID, requestURL, fetchBalances])

  // Load bundles and operations for the selected style.
  useEffect(() => {
    if (!organizationID || !filtersInitialized || !filters.styleID) return

    fetchBundles({
      url: `${base}/bundles?style_id=${encodeURIComponent(
        filters.styleID
      )}&limit=${MAX_OPTION_LIMIT}&offset=0`,
    })

    fetchOperations({
      url: `${base}/styles/${encodeURIComponent(
        filters.styleID
      )}/operations?limit=${MAX_OPTION_LIMIT}&offset=0`,
    })
  }, [
    organizationID,
    base,
    filtersInitialized,
    filters.styleID,
    fetchBundles,
    fetchOperations,
  ])

  // Clear all filters.
  const clearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setOffset(0)
    // remove search params
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.delete("style_id")
    searchParams.delete("bundle_id")
    searchParams.delete("operation_id")
    const newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString()
    window.history.replaceState(null, "", newRelativePathQuery)
  }

  const hasActiveFilters = Object.values(filters).some((value) =>
    Boolean(value.trim())
  )

  const hasNextPage = offset + balances.length < summary.total_workers
  const isEmptyPage = balances.length === 0 && offset > 0

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Organization unavailable"
        description="Your organization information could not be loaded."
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PendingPaymentsHeader filters={filters} />
      <WorkerPaymentSummary
        summary={summary}
        isLoading={isLoading}
        error={balancesError}
      />

      <div className="flex h-full min-h-0 flex-col gap-4 lg:flex-row">
        <WorkerPaymentFilters
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
          filters={filters}
          workersError={workersError}
          stylesError={stylesError}
          bundlesError={bundlesError}
          operationsError={operationsError}
        />

        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-4">
          {!filtersInitialized || (isLoading && !balancesResponse) ? (
            <Loader text="Loading worker payments" />
          ) : balancesError ? (
            <StateComponent
              className="rounded-none"
              ICON={<AlertCircle />}
              message={balancesError || "Something went wrong"}
              description="An error occurred while loading worker payment balances."
            />
          ) : !isLoading && isEmptyPage ? (
            <StateComponent
              message="No more workers on this page"
              ICON={<Users />}
              description="There are no workers available on this page."
              PortalButton={
                <Button variant="outline" onClick={() => setOffset(0)}>
                  Go to first page
                </Button>
              }
            />
          ) : !isLoading && balances.length === 0 ? (
            <StateComponent
              message={
                hasActiveFilters
                  ? "No worker's pending payments found"
                  : "No pending payments"
              }
              ICON={<Users />}
              description={
                hasActiveFilters
                  ? "Try changing or clearing your filters."
                  : "There are currently no outstanding worker payments. All worker earnings have been settled."
              }
              PortalButton={
                hasActiveFilters ? (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <WorkerPaymentsTable
              balances={balances}
              isLoading={isLoading}
              limit={limit}
              offset={offset}
              totalItems={summary.total_workers}
              hasNextPage={hasNextPage}
              setOffset={setOffset}
              setLimit={(nextLimit) => {
                setLimit(nextLimit)
                setOffset(0)
              }}
              filters={filters}
            />
          )}
        </div>
      </div>
    </div>
  )
}
