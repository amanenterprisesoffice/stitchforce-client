export interface ProductionEntry {
  id: string
  organization_id?: string
  bundle_id: string
  worker_id: string
  style_operation_id: string
  quantity: number
  rate_per_piece: number
  total_amount: number
  production_date: string
  remarks?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface ProductionWorker {
  id: string
  name?: string
  first_name?: string
  last_name?: string
  worker_name?: string
  worker_code?: string
  status?: string
  is_active?: boolean
  active?: boolean
}

export interface ProductionBundle {
  id: string
  bundle_number: string
  style_id: string
  size_id?: string
  quantity: number
  status?: string
  deleted_at?: string | null
}

export interface ProductionStyle {
  id: string
  name: string
  style_number?: string
}

export interface StyleOperation {
  id: string
  name: string
  rate_per_piece: number
}

export interface ProductionEntryPayload {
  bundle_id: string
  worker_id: string
  style_operation_id: string
  quantity: number
  production_date: string
  remarks?: string
}

export interface UpdateProductionEntryPayload {
  bundle_id: string
  worker_id: string
  quantity: number
  production_date: string
  remarks?: string
}

export const productionEntryDefaults: ProductionEntryPayload = {
  bundle_id: "",
  worker_id: "",
  style_operation_id: "",
  quantity: 1,
  production_date: new Date().toISOString().slice(0, 16),
  remarks: "",
}

export function unwrapList<T>(value: any, keys: string[] = []): T[] {
  if (Array.isArray(value)) return value
  for (const key of keys) {
    if (Array.isArray(value?.[key])) return value[key]
  }
  if (Array.isArray(value?.data)) return value.data
  return []
}

export function getWorkerName(worker?: ProductionWorker) {
  if (!worker) return "Unknown worker"
  return worker.name || worker.worker_name ||
    [worker.first_name, worker.last_name].filter(Boolean).join(" ") ||
    worker.worker_code || "Unnamed worker"
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0) / 100)
}
