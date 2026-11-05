import type { Bundle } from "./bundle"
import type { GarmentWorker } from "./garmentWorker"
import type { Style } from "./style"
import type { StyleOperation } from "./styleops"

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

  worker?: GarmentWorker
  bundle?: Bundle
  style?: Style
  operation?: StyleOperation

  created_at?: string
  updated_at?: string
  deleted_at?: string | null
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
