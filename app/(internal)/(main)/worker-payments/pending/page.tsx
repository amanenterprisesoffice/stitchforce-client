"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { IndianRupee, Wallet, Clock, Users } from "lucide-react"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import StateComponent from "@/components/StateComponent"
import Pagination from "@/components/ui/pagination"
import DebouncedSearch from "@/components/ui/debounced-search"

import { formatMoney } from "@/utils/utils"

import WorkerPaymentsTable, {
  type WorkerPaymentBalance,
} from "./components/table"
import PendingPayments from "./components/header"

const DEFAULT_LIMIT = 10

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

function unwrapBalances(response: any): WorkerPaymentBalance[] {
  if (Array.isArray(response)) return response

  if (Array.isArray(response?.balances)) return response.balances
  if (Array.isArray(response?.workers)) return response.workers
  if (Array.isArray(response?.data)) return response.data

  return []
}

function buildQuery(search: string, limit: number, offset: number) {
  const params = new URLSearchParams()

  if (search.trim()) {
    params.set("search", search.trim())
  }

  params.set("limit", String(limit))
  params.set("offset", String(offset))

  return params.toString()
}

export default function WorkerPaymentsPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const balancesURL = organizationID
    ? `/api/organizations/${organizationID}/worker-payments/balances`
    : ""

  const [search, setSearch] = useState("")
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(0)

  const requestURL = useMemo(() => {
    if (!balancesURL) return ""

    return `${balancesURL}?${buildQuery(search, limit, offset)}`
  }, [balancesURL, search, limit, offset])

  const {
    data: balancesData,
    isLoading,
    refetch: fetchBalances,
  } = useFetch<unknown>({
    auto: true,
    url: requestURL,
  })

  const balances = useMemo(() => unwrapBalances(balancesData), [balancesData])

  const totalItems = useMemo(() => readTotal(balancesData), [balancesData])

  useEffect(() => {
    if (!organizationID) return

    fetchBalances()
  }, [requestURL, organizationID, fetchBalances])

  // Summary totals for the returned workers.
  const summary = useMemo(
    () =>
      balances.reduce(
        (totals, balance) => ({
          earned: totals.earned + balance.total_earned,
          paid: totals.paid + balance.total_paid,
          pending: totals.pending + balance.total_pending,
        }),
        {
          earned: 0,
          paid: 0,
          pending: 0,
        }
      ),
    [balances]
  )

  const hasNextPage =
    totalItems !== undefined
      ? offset + balances.length < totalItems
      : balances.length === limit

  const isEmptyPage = balances.length === 0 && offset > 0

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setOffset(0)
  }, [])

  const clearSearch = () => {
    setSearch("")
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

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PendingPayments count={totalItems ?? 0} />

      {/* Search */}
      <DebouncedSearch
        value={search}
        onChange={handleSearchChange}
        placeholder="Search workers..."
        label="Find Workers"
      />

      {/* Workers table */}
      <div className="relative flex flex-1 flex-col gap-4">
        {isLoading && !balancesData ? (
          <Loader text="Loading pending payments" />
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
            message={search ? "No workers found" : "No pending payments"}
            ICON={<Users />}
            description={
              search
                ? "Try searching with a different worker name, phone number, or ID."
                : "There are currently no outstanding worker payments. All worker earnings have been settled."
            }
            PortalButton={
              search ? (
                <Button variant="outline" onClick={clearSearch}>
                  Clear search
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <WorkerPaymentsTable
              balances={balances}
              isLoading={isLoading}
              limit={limit}
              offset={offset}
              totalItems={balances.length}
              hasNextPage={hasNextPage}
              setOffset={setOffset}
              setLimit={setLimit}
            />
          </>
        )}
      </div>
    </div>
  )
}
