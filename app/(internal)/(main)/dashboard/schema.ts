import type { ProductionEntry } from "@/utils/zodSchema/production-entry"
import type { GarmentWorker, SlimWorker } from "@/utils/zodSchema/garmentWorker"

export interface DashboardOverview {
  total_workers: number
  active_workers: number
  inactive_workers: number
  total_styles: number
  total_bundles: number
  total_production_entries: number
  total_earned: number
  total_paid: number
  total_pending: number
  bundle_status: DashboardBundleStatus
  today: DashboardPeriodStats
}

export interface DashboardPeriodStats {
  production_quantity: number
  production_entries: number
  production_amount: number
  payment_count: number
  payment_amount: number
}

export type DashboardGroupBy =
  "daily" | "weekly" | "half_monthly" | "monthly" | "quarterly"

export interface DashboardTrendBucket extends DashboardPeriodStats {
  label: string
  from_date: string
  to_date: string
}

export interface DashboardTrend {
  from_date: string
  to_date: string
  group_by: DashboardGroupBy
  buckets: DashboardTrendBucket[]
}

export interface DashboardBundleStatus {
  created: number
  ready: number
  in_progress: number
  completed: number
  cancelled: number
}

export interface OrganizationDashboard {
  period: DashboardPeriodStats
  trend: DashboardTrend
}

export interface DashboardWorker {
  id: string
  name: string
  phone: string
  gender: string
  photo_url?: string
  status: "active" | "inactive"
  created_at: string
}

export interface DashboardPayment {
  id: string
  worker_id: string
  amount: number
  payment_date: string
  payment_method: "cash" | "bank" | "upi" | "cheque"
  reference: string
  remarks: string
  status: "completed" | "voided"
  worker: SlimWorker
}

export interface DashboardData {
  stats: OrganizationDashboard | null
  productionEntries: ProductionEntry[]
  payments: DashboardPayment[]
  workers: GarmentWorker[]
}
