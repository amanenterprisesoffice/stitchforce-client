"use client"

import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type {
  GarmentWorker,
  GarmentWorkerFormValues,
} from "../../../../../utils/types/garmentWorker"

import {
  garmentWorkerSchema,
  initialGarmentWorkerValues,
} from "../../../../../utils/types/garmentWorker"

import FormField from "@/components/ui/FormField"
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
import FormSelect from "@/components/ui/FormSelect"
import FileInput from "@/components/ui/Fileinput"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingWorker: GarmentWorker | null
  onSubmit: (values: GarmentWorkerFormValues) => Promise<void>
  isSaving: boolean
}

export default function WorkerFormDialog({
  open,
  onOpenChange,
  editingWorker,
  onSubmit,
  isSaving,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GarmentWorkerFormValues>({
    resolver: zodResolver(garmentWorkerSchema),
    defaultValues: initialGarmentWorkerValues,
  })

  // Populate form when editing, reset when creating
  useEffect(() => {
    if (!open) return

    if (editingWorker) {
      reset({
        name: editingWorker.name,
        phone: editingWorker.phone,
        gender: editingWorker.gender,
        photo: [], // Add this line to populate the photo field when editing
      })
    } else {
      reset(initialGarmentWorkerValues)
    }
  }, [open, editingWorker, reset])

  const handleFormSubmit: SubmitHandler<GarmentWorkerFormValues> = async (
    values
  ) => {
    await onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingWorker ? "Edit Worker" : "Add Worker"}
          </DialogTitle>

          <DialogDescription>
            {editingWorker
              ? "Update the garment worker's information."
              : "Add a new garment worker to your organization."}
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
          <FileInput
            id="photo"
            label="Profile Photo"
            value={watch("photo") ?? []}
            onChange={(files) =>
              setValue("photo", files, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            disabled={isSaving}
            error={errors.photo?.message}
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

              {editingWorker ? "Save Changes" : "Add Worker"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
