"use client"

import { useEffect } from "react"

import { useUser } from "@/contexts/UserContext"
import useFetch from "@/hooks/useFetch"

import StateComponent from "@/components/StateComponent"

import OverviewCards from "./components/overview-cards"
import DashboardTrend from "./components/trend"
import BundleStatus from "./components/bundle-status"
import RecentProduction from "./components/recent-production"
import RecentPayments from "./components/recent-payments"
import RecentWorkers from "./components/recent-workers"

import type {
  OrganizationDashboard,
  DashboardPayment,
  DashboardOverview,
} from "./schema"

import type { ProductionEntry } from "@/utils/types/production-entry"
import type { GarmentWorker } from "@/utils/types/garmentWorker"

import DashboardHeader from "./components/header"

export default function DashboardPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  // API REQUESTS

  const {
    data: stats,
    isLoading: isDashboardLoading,
    refetch: fetchDashboard,
  } = useFetch<DashboardOverview>()

  const {
    data: productionEntries,
    isLoading: isProductionLoading,
    refetch: fetchProduction,
  } = useFetch<ProductionEntry[]>()

  const {
    data: payments,
    isLoading: isPaymentsLoading,
    refetch: fetchPayments,
  } = useFetch<DashboardPayment[]>()

  const {
    data: workers,
    isLoading: isWorkersLoading,
    refetch: fetchWorkers,
  } = useFetch<GarmentWorker[]>()

  // FETCH OVERVIEW

  useEffect(() => {
    if (!organizationID) return

    fetchDashboard({
      url: `/api/organizations/${organizationID}/dashboard`,
      method: "GET",
    })
  }, [organizationID, fetchDashboard])

  // FETCH RECENT PRODUCTION ENTRIES

  useEffect(() => {
    if (!organizationID) return

    fetchProduction({
      url: `/api/organizations/${organizationID}/production-entries?limit=10&offset=0`,
      method: "GET",
    })
  }, [organizationID, fetchProduction])

  // FETCH RECENT PAYMENTS

  useEffect(() => {
    if (!organizationID) return

    fetchPayments({
      url: `/api/organizations/${organizationID}/worker-payments?limit=10&offset=0`,
      method: "GET",
    })
  }, [organizationID, fetchPayments])

  // FETCH RECENT WORKERS

  useEffect(() => {
    if (!organizationID) return

    fetchWorkers({
      url: `/api/organizations/${organizationID}/garment-workers?limit=10&offset=0`,
      method: "GET",
    })
  }, [organizationID, fetchWorkers])

  // REFRESH

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

  // ORGANIZATION CHECK

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Organization unavailable"
        description="We couldn't identify your organization. Please sign in again."
      />
    )
  }

  const formattedToday = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-5 p-4 md:p-6">
      {/* HEADER */}
      <DashboardHeader
        today={formattedToday}
        refreshDashboard={refreshDashboard}
        isDashboardLoading={isDashboardLoading}
        isProductionLoading={isProductionLoading}
        isPaymentsLoading={isPaymentsLoading}
        isWorkersLoading={isWorkersLoading}
      />

      <OverviewCards stats={stats} isLoading={isDashboardLoading} />

      <DashboardTrend organizationID={organizationID} />

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <RecentWorkers workers={workers} isLoading={isWorkersLoading} />
        <BundleStatus stats={stats} isLoading={isDashboardLoading} />
      </div>

      {/* RECENT PRODUCTION */}
      <RecentProduction
        entries={productionEntries}
        isLoading={isProductionLoading}
      />

      {/* RECENT PAYMENTS */}
      <RecentPayments payments={payments} isLoading={isPaymentsLoading} />
    </main>
  )
}
