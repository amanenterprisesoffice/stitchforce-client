import type { GarmentWorker } from "@/utils/types/garmentWorker"
import z from "zod"
import type {
  ProductionEntryBundle,
  ProductionEntryStyle,
  ProductionEntryOperation,
} from "@/utils/types/production-entry"

export type PaymentMethod = "cash" | "bank" | "upi" | "cheque"
export type PaymentStatus = "completed" | "voided"

export interface WorkerPayment {
  id: string
  organization_id: string
  worker_id: string
  amount: number
  payment_date: string
  payment_method: PaymentMethod
  reference: string
  remarks: string
  status: PaymentStatus
  created_at: string
  updated_at: string
  worker?: GarmentWorker
}

export const createWorkerPaymentSchema = z
  .object({
    worker_id: z.string().min(1, "Please select a worker"),

    from_date: z.string().min(1, "Start date is required"),

    to_date: z.string().min(1, "End date is required"),

    payment_date: z.string().min(1, "Payment date is required"),

    payment_method: z.enum(["cash", "bank", "upi", "cheque"], {
      message: "Please select a payment method",
    }),

    reference: z.string().max(200, "Maximum 200 characters").optional(),

    remarks: z.string().max(1000, "Maximum 1000 characters").optional(),
  })
  .refine((values) => values.to_date >= values.from_date, {
    message: "To date cannot be before from date",
    path: ["to_date"],
  })

export type CreateWorkerPaymentValues = z.infer<
  typeof createWorkerPaymentSchema
>

export interface WorkerPaymentSummary {
  total_earned: number
  total_paid: number
  total_pending: number
}

export interface CreateWorkerPaymentPayload {
  worker_id: string
  from_date: string
  to_date: string
  payment_date: string
  payment_method: PaymentMethod
  reference?: string
  remarks?: string
}

export interface PeriodPreset {
  label: string
  from_date: string
  to_date: string
}
