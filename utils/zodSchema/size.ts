
import { z } from "zod"

export interface Size {
  id: string
  organization_id: string
  name: string
  created_at: string
  updated_at: string
}

export const sizeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Size name is required")
    .max(100, "Size name cannot exceed 100 characters"),
})

export type SizeFormValues = z.infer<typeof sizeSchema>

export const initialSizeValues: SizeFormValues = {
  name: "",
}
