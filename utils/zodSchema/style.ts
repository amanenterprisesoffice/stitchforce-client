
import { z } from "zod"

export interface Style {
  id: string
  organization_id: string
  name: string
  style_number: string
  description: string
  created_at: string
  updated_at: string
}

export const styleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Style name must be at least 2 characters")
    .max(200, "Style name cannot exceed 200 characters"),

  style_number: z
    .string()
    .trim()
    .min(1, "Style number is required")
    .max(100, "Style number cannot exceed 100 characters"),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters"),
})

export type StyleFormValues = z.infer<typeof styleSchema>

export const initialStyleValues: StyleFormValues = {
  name: "",
  style_number: "",
  description: "",
}