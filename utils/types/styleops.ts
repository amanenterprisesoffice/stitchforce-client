import { z } from "zod"

export interface StyleOperation {
  id: string
  organization_id: string
  style_id: string
  name: string
  rate_per_piece: number
  created_at: string
  updated_at: string
}

export const operationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Operation name must be at least 2 characters")
    .max(200, "Operation name cannot exceed 200 characters"),

  // User enters rupees, API receives paise.
  rate_per_piece: z
    .string()
    .trim()
    .min(1, "Rate per piece is required")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Enter a valid amount with up to 2 decimal places"
    )
    .transform((value) => {
      const [rupees, paise = ""] = value.split(".")
      return Number(rupees) * 100 + Number(paise.padEnd(2, "0"))
    })
    .refine(
      (value) => Number.isSafeInteger(value) && value >= 0,
      "Enter a valid rate"
    ),
})

export type OperationFormValues = z.input<typeof operationSchema>

export type OperationPayload = z.output<typeof operationSchema>

export const initialOperationValues: OperationFormValues = {
  name: "",
  rate_per_piece: "",
}
