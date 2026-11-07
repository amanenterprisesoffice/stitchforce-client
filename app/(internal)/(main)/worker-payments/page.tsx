"use client"

import { useCallback, useMemo, useState } from "react"
import { Plus, Wallet } from "lucide-react"
import { toast } from "sonner"

import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import Pagination from "@/components/ui/pagination"
import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"

import WorkerPaymentsHeader from "./components/header"
import WorkerPaymentFilters, {
  type WorkerPaymentFiltersValue,
} from "./components/filters"
import WorkerPaymentsTable from "./components/table"
import VoidPaymentDialog from "./components/void-dialog"

import type {
  CreateWorkerPaymentValues,
  WorkerPayment,
} from "@/utils/zodSchema/payments"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import useFetch from "@/hooks/useFetch"

const DEFAULT_LIMIT = 25

const EMPTY_FILTERS: WorkerPaymentFiltersValue = {
  worker_id: "",
  status: "",
  from_date: "",
  to_date: "",
}

function buildQuery(
  filters: WorkerPaymentFiltersValue,
  limit: number,
  offset: number
) {
  const params = new URLSearchParams()

  if (filters.worker_id) {
    params.set("worker_id", filters.worker_id)
  }

  if (filters.status) {
    params.set("status", filters.status)
  }

  if (filters.from_date) {
    params.set("from_date", filters.from_date)
  }

  if (filters.to_date) {
    params.set("to_date", filters.to_date)
  }

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

export default function WorkerPaymentsPage() {
  const { user } = useUser()
  const router = useRouter()
  const organizationID = user?.organization_id

  const base = organizationID ? `/api/organizations/${organizationID}` : ""

  const paymentsURL = `${base}/worker-payments`

  // Filters
  const [filters, setFilters] =
    useState<WorkerPaymentFiltersValue>(EMPTY_FILTERS)

  // Pagination
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(0)

  // Dialogs
  const [paymentToVoid, setPaymentToVoid] = useState<WorkerPayment | null>(null)

  // Request URL
  const requestURL = useMemo(() => {
    return `${paymentsURL}?${buildQuery(filters, limit, offset)}`
  }, [paymentsURL, filters, limit, offset])

  // Fetch workers
  const { data: workersData, isLoading: workersLoading } = useFetch({
    auto: !!organizationID,
    url: `${base}/garment-workers?limit=100&offset=0`,
    method: "GET",
  })

  // Fetch payments
  const {
    data: paymentsData,
    isLoading,
    refetch: fetchPayments,
  } = useFetch({
    auto: !!organizationID,
    url: requestURL,
    method: "GET",
  })

  // Mutations
  const { refetch: mutatePayment, isLoading: isMutating } = useFetch({
    auto: false,
  })

  // Normalize workers
  const workers: GarmentWorker[] = Array.isArray(workersData)
    ? workersData
    : (workersData?.workers ?? [])

  // Normalize payments
  const payments: WorkerPayment[] = Array.isArray(paymentsData)
    ? paymentsData
    : (paymentsData?.payments ?? [])

  // Total count
  const totalItems = useMemo(() => readTotal(paymentsData), [paymentsData])

  const hasNextPage =
    totalItems !== undefined
      ? offset + payments.length < totalItems
      : payments.length === limit

  // Load payments
  const loadPayments = useCallback(() => {
    if (!organizationID) return

    fetchPayments({
      url: requestURL,
      method: "GET",
      onError: (error: any) =>
        toast.error(error?.message || "Failed to fetch payments"),
    })
  }, [organizationID, requestURL, fetchPayments])

  // Filter changes
  const handleFiltersChange = useCallback(
    (nextFilters: WorkerPaymentFiltersValue) => {
      setFilters(nextFilters)
      setOffset(0)
    },
    []
  )

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS)
    setOffset(0)
  }, [])



  // Void payment
  const handleVoid = async () => {
    if (!paymentToVoid || !organizationID) return

    await mutatePayment({
      url: `${paymentsURL}/${paymentToVoid.id}/void`,
      method: "PATCH",
      onSuccess: () => {
        toast.success("Payment voided successfully")
        setPaymentToVoid(null)
        loadPayments()
      },
      onError: (error: any) =>
        toast.error(error?.message || "Failed to void payment"),
    })
  }

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
      {/* Header */}
      <WorkerPaymentsHeader
        count={totalItems ?? payments.length}
      />

      {/* Side-by-side filters and table */}
      <div className="flex h-full min-h-0 gap-4">
        <WorkerPaymentFilters
          workers={workers}
          onChange={handleFiltersChange}
          onClear={clearFilters}
        />

        {/* Payments table */}
        <div className="relative flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <div className="min-h-0 flex-1">
            {isLoading && !paymentsData ? (
              <Loader text="Loading payments" />
            ) : isEmptyPage ? (
              <StateComponent
                message="No more payments on this page"
                ICON={<Wallet />}
                description="There are no payments available at this page. You can go back to the previous page to view available paymentsz."
                PortalButton={
                  <Button variant="outline" onClick={() => setOffset(0)}>
                    Go to first page
                  </Button>
                }
              />
            ) : payments.length === 0 ? (
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
              <WorkerPaymentsTable
                payments={payments}
                workers={workers}
                onVoid={setPaymentToVoid}
              />
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

      {/* Void payment */}
      <VoidPaymentDialog
        open={!!paymentToVoid}
        onOpenChange={(open) => {
          if (!open && !isMutating) {
            setPaymentToVoid(null)
          }
        }}
        payment={paymentToVoid}
        onConfirm={handleVoid}
        isVoiding={isMutating}
      />
    </div>
  )
}
