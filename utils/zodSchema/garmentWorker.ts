
import { z } from "zod"

export const garmentWorkerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  gender: z.enum(["male", "female", "other"]),
  photo: z.array(z.instanceof(File)).optional().default([]),
})

// Input type (before Zod parsing)
export type GarmentWorkerFormValues = z.input<
  typeof garmentWorkerSchema
>

// Output type (after Zod parsing)
export type ParsedGarmentWorkerFormValues = z.output<
  typeof garmentWorkerSchema
>

export const initialGarmentWorkerValues: GarmentWorkerFormValues = {
  name: "",
  phone: "",
  gender: "male",
  photo: [],
}

export interface GarmentWorker {
  id: string
  organization_id: string
  name: string
  phone: string
  gender: "male" | "female" | "other"
  photo_url?: string
  status: "active" | "inactive" 
}




export function getWorkerName(worker?: GarmentWorker) {
  return worker?.name?.trim() || "Unknown worker"
}

export const getValidGender = (
  gender: string
): GarmentWorkerFormValues["gender"] => {
  if (gender === "male" || gender === "female" || gender === "other") {
    return gender
  }

  return "other"
}