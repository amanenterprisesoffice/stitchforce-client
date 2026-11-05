"use client"

import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { GarmentWorker, UpdateGarmentWorkerPayload } from "../page"

import {
  garmentWorkerSchema,
  getValidGender,
  initialGarmentWorkerValues,
  type GarmentWorkerFormValues,
} from "@/utils/zodSchema/garmentWorker"

import FormField from "@/components/ui/FormField"
import FormSelect from "@/components/ui/FormSelect"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import Loader from "@/components/ui/Loader"
import z from "zod"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  worker: GarmentWorker
  onSubmit: (values: UpdateGarmentWorkerPayload) => Promise<void>
  isSaving: boolean
}

export default function EditGarmentWorkerDialog({
  open,
  onOpenChange,
  worker,
  onSubmit,
  isSaving,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<
    GarmentWorkerFormValues,
    any,
    z.output<typeof garmentWorkerSchema>
  >({
    resolver: zodResolver(garmentWorkerSchema),
    defaultValues: initialGarmentWorkerValues,
  })
  // Populate form when editing worker
  useEffect(() => {
    if (!open) return

    reset({
      name: worker.name,
      phone: worker.phone,
      gender: getValidGender(worker.gender),
      photo: [],
    })
  }, [open, worker, reset])

  const handleFormSubmit: SubmitHandler<GarmentWorkerFormValues> = async (
    values
  ) => {
    await onSubmit({
      name: values.name.trim(),
      phone: values.phone.trim(),
      gender: values.gender,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Worker</DialogTitle>

          <DialogDescription>
            Update the worker's name, phone number, and gender.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            id="name"
            label="Worker Name"
            placeholder="e.g. Rahul Sharma"
            register={register}
            errors={errors}
          />

          {/* Phone */}
          <FormField
            id="phone"
            label="Phone Number"
            placeholder="e.g. 9876543210"
            register={register}
            errors={errors}
          />

          {/* Gender */}
          <FormSelect
            id="gender"
            label="Gender"
            control={control}
            errors={errors}
            disabled={isSaving}
            placeholder="Select gender"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
