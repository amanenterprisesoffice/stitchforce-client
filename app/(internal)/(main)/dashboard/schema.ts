import type { ProductionEntry } from "@/utils/zodSchema/production-entry"
import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"

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
}

export interface DashboardPeriodStats {
  production_entries: number
  production_quantity: number
  payment_count: number
  payment_amount: number
}

export interface DashboardDailyStats {
  date: string
  production_entries: number
  production_quantity: number
  payment_count: number
  payment_amount: number
}

export interface DashboardWeeklyStats extends DashboardPeriodStats {
  daily: DashboardDailyStats[]
}

export interface DashboardBundleStatus {
  created: number
  ready: number
  in_progress: number
  completed: number
  cancelled: number
}

export interface OrganizationDashboard {
  overview: DashboardOverview
  today: DashboardPeriodStats
  this_week: DashboardWeeklyStats
  this_month: DashboardPeriodStats
  bundle_status: DashboardBundleStatus
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
  worker: {
    id?: string
    name: string
    phone?: string
    photo_url?: string
  }
}

export interface DashboardData {
  stats: OrganizationDashboard | null
  productionEntries: ProductionEntry[]
  payments: DashboardPayment[]
  workers: GarmentWorker[]
}