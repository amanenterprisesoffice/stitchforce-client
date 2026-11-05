
import { z } from "zod"

export interface Bundle {
  id: string
  organization_id: string
  bundle_number: string
  style_id: string
  size_id: string
  quantity: number
  attributes: Record<string, string>
  status: BundleStatus
  remarks: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
}


export type BundleStatus = "created" | "ready" | "in_progress" | "completed"

export interface BundleAttribute {
  key: string
  value: string
}

export const bundleSchema = z.object({
  bundle_number: z
    .string()
    .trim()
    .min(1, "Bundle number is required")
    .max(100, "Bundle number cannot exceed 100 characters"),

  style_id: z
    .string()
    .min(1, "Please select a style"),

  size_id: z
    .string()
    .min(1, "Please select a size"),

  quantity: z
    .number({
      message: "Quantity must be a number",
    })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than zero"),

  attributes: z.record(z.string(), z.string()),

  remarks: z
    .string()
    .max(1000, "Remarks cannot exceed 1000 characters"),
})

export type BundleFormValues = z.infer<typeof bundleSchema>

export const initialBundleValues: BundleFormValues = {
  bundle_number: "",
  style_id: "",
  size_id: "",
  quantity: 1,
  attributes: {},
  remarks: "",
}


export const STATUS_LABELS: Record<BundleStatus, string> = {
  created: "Created",
  ready: "Ready",
  in_progress: "In Progress",
  completed: "Completed",
}