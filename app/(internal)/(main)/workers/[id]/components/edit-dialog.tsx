"use client"

import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  GarmentWorker,
  garmentWorkerSchema,
  getValidGender,
  initialGarmentWorkerValues,
  type GarmentWorkerFormValues,
} from "@/utils/types/garmentWorker"

import FormField from "@/components/ui/FormField"
import FormSelect from "@/components/ui/FormSelect"
import FileInput from "@/components/ui/Fileinput"
import Loader from "@/components/ui/Loader"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  worker: GarmentWorker
  onSubmit: (formData: FormData) => Promise<void>
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<GarmentWorkerFormValues>({
    resolver: zodResolver(garmentWorkerSchema),
    defaultValues: initialGarmentWorkerValues,
  })

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
    const formData = new FormData()

    formData.append("name", values.name.trim())
    formData.append("phone", values.phone.trim())
    formData.append("gender", values.gender)

    if (values.photo?.[0]) {
      formData.append("photo", values.photo[0])
    }

    await onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Worker</DialogTitle>

          <DialogDescription>
            Update the worker's information and profile photo.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <FormField
            id="name"
            label="Worker Name"
            placeholder="e.g. Rahul Sharma"
            register={register}
            errors={errors}
          />

          <FormField
            id="phone"
            label="Phone Number"
            placeholder="e.g. 9876543210"
            register={register}
            errors={errors}
          />

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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}