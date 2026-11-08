"use client"

import { useEffect } from "react"
import { CalendarDays, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useUser } from "@/contexts/UserContext"
import useFetch from "@/hooks/useFetch"

import StateComponent from "@/components/StateComponent"

import OverviewCards from "./components/overview-cards"
import WeeklyActivity from "./components/weekly-activity"
import BundleStatus from "./components/bundle-status"
import RecentProduction from "./components/recent-production"
import RecentPayments from "./components/recent-payments"
import RecentWorkers from "./components/recent-workers"

import type { OrganizationDashboard, DashboardPayment } from "./schema"

import type { ProductionEntry } from "@/utils/zodSchema/production-entry"
import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"

interface ListResponse<T> {
  data?: T[]
  items?: T[]
  workers?: T[]
  payments?: T[]
  production_entries?: T[]
}

function extractList<T>(response: unknown, key: keyof ListResponse<T>): T[] {
  if (Array.isArray(response)) {
    return response as T[]
  }

  if (!response || typeof response !== "object") {
    return []
  }

  const result = response as ListResponse<T>

  const value = result[key] ?? result.items ?? result.data

  return Array.isArray(value) ? value : []
}

export default function DashboardPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  // --------------------------------------------------
  // API REQUESTS
  // --------------------------------------------------

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    refetch: fetchDashboard,
  } = useFetch()

  const {
    data: productionData,
    isLoading: isProductionLoading,
    refetch: fetchProduction,
  } = useFetch()

  const {
    data: paymentData,
    isLoading: isPaymentsLoading,
    refetch: fetchPayments,
  } = useFetch()

  const {
    data: workerData,
    isLoading: isWorkersLoading,
    refetch: fetchWorkers,
  } = useFetch()

  // --------------------------------------------------
  // FETCH DASHBOARD DATA
  // --------------------------------------------------

  useEffect(() => {
    if (!organizationID) return

    fetchDashboard({
      url: `/api/organizations/${organizationID}/dashboard`,
      method: "GET",
    })
  }, [organizationID, fetchDashboard])

  // --------------------------------------------------
  // FETCH RECENT PRODUCTION ENTRIES
  // --------------------------------------------------

  useEffect(() => {
    if (!organizationID) return

    fetchProduction({
      url: `/api/organizations/${organizationID}/production-entries?limit=10&offset=0`,
      method: "GET",
    })
  }, [organizationID, fetchProduction])

  // --------------------------------------------------
  // FETCH RECENT PAYMENTS
  // --------------------------------------------------

  useEffect(() => {
    if (!organizationID) return

    fetchPayments({
      url: `/api/organizations/${organizationID}/worker-payments?limit=10&offset=0`,
      method: "GET",
    })
  }, [organizationID, fetchPayments])

  // --------------------------------------------------
  // FETCH RECENT WORKERS
  // --------------------------------------------------

  useEffect(() => {
    if (!organizationID) return

    fetchWorkers({
      url: `/api/organizations/${organizationID}/garment-workers?limit=10&offset=0`,
      method: "GET",
    })
  }, [organizationID, fetchWorkers])

  // --------------------------------------------------
  // NORMALIZE RESPONSES
  // --------------------------------------------------

  const stats = (dashboardData?.data ??
    dashboardData) as OrganizationDashboard | null

  const productionEntries = extractList<ProductionEntry>(
    productionData,
    "production_entries"
  )

  const payments = extractList<DashboardPayment>(paymentData, "payments")

  const workers = extractList<GarmentWorker>(workerData, "workers")

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  const refreshDashboard = () => {
    if (!organizationID) return

    fetchDashboard({
      url: `/api/organizations/${organizationID}/dashboard`,
      method: "GET",
    })

    fetchProduction({
      url: `/api/organizations/${organizationID}/production-entries?limit=10&offset=0`,
      method: "GET",
    })

    fetchPayments({
      url: `/api/organizations/${organizationID}/worker-payments?limit=10&offset=0`,
      method: "GET",
    })

    fetchWorkers({
      url: `/api/organizations/${organizationID}/garment-workers?limit=10&offset=0`,
      method: "GET",
    })
  }

  // --------------------------------------------------
  // ORGANIZATION CHECK
  // --------------------------------------------------

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Organization unavailable"
        description="We couldn't identify your organization. Please sign in again."
      />
    )
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-5 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening in your factory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            {today}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={refreshDashboard}
            disabled={
              isDashboardLoading ||
              isProductionLoading ||
              isPaymentsLoading ||
              isWorkersLoading
            }
            title="Refresh dashboard"
          >
            <RefreshCw
              className={`size-4 ${isDashboardLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* OVERVIEW */}
      <OverviewCards stats={stats} isLoading={isDashboardLoading} />

      {/* WEEKLY ACTIVITY + BUNDLE STATUS */}
      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <WeeklyActivity stats={stats} isLoading={isDashboardLoading} />

        <BundleStatus stats={stats} isLoading={isDashboardLoading} />
      </div>

      {/* RECENT PRODUCTION */}
      <RecentProduction
        entries={productionEntries}
        isLoading={isProductionLoading}
      />

      {/* RECENT PAYMENTS */}
      <RecentPayments payments={payments} isLoading={isPaymentsLoading} />

      {/* RECENT WORKERS */}
      <RecentWorkers workers={workers} isLoading={isWorkersLoading} />
    </main>
  )
}
