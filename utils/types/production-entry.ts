import type { GarmentWorker, SlimWorker } from "./garmentWorker"

import { z } from "zod"

export const productionEntrySchema = z.object({
  style_id: z.string().min(1, "Please select a style"),
  bundle_id: z.string().min(1, "Please select a bundle"),
  style_operation_id: z.string().min(1, "Please select an operation"),
  worker_id: z.string().min(1, "Please select a worker"),
  production_date: z.string().min(1, "Production date is required"),
  remarks: z.string().max(1000, "Remarks cannot exceed 1000 characters"),
})

export type ProductionEntryFormValues = z.infer<typeof productionEntrySchema>

// Exactly matches the Go CreateProductionEntry request.
export interface ProductionEntryPayload {
  bundle_id: string
  worker_id: string
  style_operation_id: string
  production_date: string
  remarks: string
}

export interface ProductionEntry {
  id: string
  organization_id?: string

  bundle_id: string
  worker_id: string
  style_operation_id: string

  quantity: number
  rate_per_piece: number
  total_amount: number

  // Payment information (amounts in paise)
  paid_amount: number
  pending_amount: number
  payment_status: "pending" | "partially_paid" | "paid"

  production_date: string
  remarks?: string

  worker?: SlimWorker | GarmentWorker
  bundle?: ProductionEntryBundle
  style?: ProductionEntryStyle
  operation?: ProductionEntryOperation

  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}



export interface ProductionEntryBundle {
  id: string
  bundle_number: string
  quantity: number
  status: string
}

export interface ProductionEntryStyle {
  id: string
  name: string
  style_number: string
}

export interface ProductionEntryOperation {
  id: string
  name: string
  rate_per_piece: number
}

export interface UpdateProductionEntryPayload {
  bundle_id: string
  worker_id: string
  production_date: string
  remarks?: string
}

export const productionEntryDefaults: ProductionEntryPayload = {
  bundle_id: "",
  worker_id: "",
  style_operation_id: "",
  production_date: new Date().toISOString().slice(0, 16),
  remarks: "",
}
