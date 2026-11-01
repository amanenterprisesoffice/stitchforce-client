
import { z } from "zod"

export const garmentWorkerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(200, "Name cannot exceed 200 characters"),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^\+?[0-9]+$/, "Enter a valid phone number"),

  gender: z.enum(["male", "female", "other"], {
    error: "Please select a gender",
  }),
photo: z.array(z.instanceof(File)).optional().default([]),
})

export type GarmentWorkerFormValues = z.infer<
  typeof garmentWorkerSchema
>

export interface GarmentWorker {
  id: string
  organization_id: string
  name: string
  phone: string
  gender: "male" | "female" | "other"
  photo_url?: string
}

export const initialGarmentWorkerValues: GarmentWorkerFormValues = {
  name: "",
  phone: "",
  gender: "male",
  photo: [],
}
