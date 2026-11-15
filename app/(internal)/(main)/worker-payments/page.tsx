"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AlertCircle, Plus, Wallet } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { useUser } from "@/contexts/UserContext"
import useFetch from "@/hooks/useFetch"

import Loader from "@/components/ui/Loader"
import Pagination from "@/components/ui/pagination"
import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"

import WorkerPaymentsHeader from "./components/header"
import WorkerPaymentFilters, {
  type WorkerPaymentFiltersValue,
} from "./components/filters"
import WorkerPaymentsTable from "./components/table"
import WorkerPaymentsSummary, {
  type WorkerPaymentsSummaryData,
} from "./components/summary"

import type { WorkerPayment } from "@/utils/types/payments"

const DEFAULT_LIMIT = 25

const EMPTY_FILTERS: WorkerPaymentFiltersValue = {
  worker_id: "",
  status: "",
  from_date: "",
  to_date: "",
}

const EMPTY_SUMMARY: WorkerPaymentsSummaryData = {
  total_payments: 0,
  total_amount: 0,
  completed_payments: 0,
  completed_amount: 0,
}

export interface WorkerPaymentsResponse {
  summary: WorkerPaymentsSummaryData
  payments: WorkerPayment[]
}

function readInitialFilters(
  params: URLSearchParams
): WorkerPaymentFiltersValue {
  return {
    worker_id: params.get("worker_id") || "",
    status: params.get("status") || "",
    from_date: params.get("from_date") || "",
    to_date: params.get("to_date") || "",
  }
}

function buildQuery(
  filters: WorkerPaymentFiltersValue,
  limit: number,
  offset: number
) {
  const params = new URLSearchParams()

  if (filters.worker_id) params.set("worker_id", filters.worker_id)
  if (filters.status) params.set("status", filters.status)
  if (filters.from_date) params.set("from_date", filters.from_date)
  if (filters.to_date) params.set("to_date", filters.to_date)

  params.set("limit", String(limit))
  params.set("offset", String(offset))

  return params.toString()
}

export default function WorkerPaymentsPage() {
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()

  const organizationID = user?.organization_id

  const base = organizationID ? `/api/organizations/${organizationID}` : ""

  const paymentsURL = `${base}/worker-payments`

  // Filters
  const [filters, setFilters] =
    useState<WorkerPaymentFiltersValue>(EMPTY_FILTERS)

  const [filtersInitialized, setFiltersInitialized] = useState(false)

  // Pagination
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(0)

  const initialized = useRef(false)

  // Initialize filters and pagination from URL.
  useEffect(() => {
    if (initialized.current) return

    const params = new URLSearchParams(searchParams.toString())

    setFilters(readInitialFilters(params))

    const initialLimit = Number(params.get("limit"))
    const initialOffset = Number(params.get("offset"))

    if (Number.isInteger(initialLimit) && initialLimit > 0) {
      setLimit(initialLimit)
    }

    if (Number.isInteger(initialOffset) && initialOffset >= 0) {
      setOffset(initialOffset)
    }

    initialized.current = true
    setFiltersInitialized(true)
  }, [searchParams])

  // Fetch payments.
  const {
    data: paymentsData,
    isLoading,
    refetch: fetchPayments,
    error: paymentsError,
  } = useFetch<WorkerPaymentsResponse>({
    auto: false,
  })

  // Build request URL.
  const requestURL = useMemo(
    () => `${paymentsURL}?${buildQuery(filters, limit, offset)}`,
    [
      paymentsURL,
      filters.worker_id,
      filters.status,
      filters.from_date,
      filters.to_date,
      limit,
      offset,
    ]
  )

  // Normalize response.
  const payments: WorkerPayment[] = paymentsData?.payments ?? []
  const summary = paymentsData?.summary ?? EMPTY_SUMMARY

  // Pagination.
  const totalItems = summary.total_payments

  const hasNextPage = offset + payments.length < totalItems

  // Load payments.
  const loadPayments = useCallback(() => {
    if (!organizationID || !filtersInitialized) return

    fetchPayments({
      url: requestURL,
    })
  }, [organizationID, filtersInitialized, requestURL, fetchPayments])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  // Update individual filters.
  const handleFiltersChange = useCallback(
    <K extends keyof WorkerPaymentFiltersValue>(
      key: K,
      value: WorkerPaymentFiltersValue[K]
    ) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }))

      setOffset(0)
    },
    []
  )

  // Clear filters.
  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS)
    setOffset(0)
  }, [])

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Error"
        description="Organization not found"
      />
    )
  }

  const hasActiveFilters = Object.values(filters).some(Boolean)
  const isEmptyPage = payments.length === 0 && offset > 0

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <WorkerPaymentsHeader filters={filters} />

      <WorkerPaymentsSummary
        summary={summary}
        isLoading={isLoading}
        error={paymentsError}
      />

      <div className="flex h-full min-h-0 gap-4">
        <WorkerPaymentFilters
          filters={filters}
          onChange={handleFiltersChange}
          onClear={clearFilters}
        />

        <div className="relative flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <div className="min-h-0 flex-1">
            {isLoading && !paymentsData ? (
              <Loader text="Loading worker payments" />
            ) : paymentsError ? (
              <StateComponent
                className="rounded-none"
                ICON={<AlertCircle />}
                message={paymentsError || "Something went wrong"}
                description="An error occurred while loading worker payments."
              />
            ) : !isLoading && isEmptyPage ? (
              <StateComponent
                message="No more payments on this page"
                ICON={<Wallet />}
                description="There are no payments available on this page. Go back to the first page to view available payments."
                PortalButton={
                  <Button variant="outline" onClick={() => setOffset(0)}>
                    Go to first page
                  </Button>
                }
              />
            ) : !isLoading && payments.length === 0 ? (
              <StateComponent
                message={
                  hasActiveFilters
                    ? "No payments found"
                    : "No worker payments yet"
                }
                description={
                  hasActiveFilters
                    ? "Try changing or clearing your filters."
                    : "Record a worker payment to get started."
                }
                PortalButton={
                  !hasActiveFilters ? (
                    <Button
                      variant="outline"
                      onClick={() => router.push("/worker-payments/new")}
                    >
                      <Plus className="mr-2 size-4" />
                      Record payment
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <WorkerPaymentsTable payments={payments} isLoading={isLoading} />
            )}
          </div>

          {(payments.length > 0 || offset > 0) && (
            <Pagination
              limit={limit}
              offset={offset}
              itemCount={payments.length}
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
    </div>
  )
}
