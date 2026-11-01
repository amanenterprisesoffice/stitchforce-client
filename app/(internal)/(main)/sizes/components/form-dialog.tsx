
"use client"

import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type {
  Size,
  SizeFormValues,
} from "@/utils/zodSchema/size"

import {
  sizeSchema,
  initialSizeValues,
} from "@/utils/zodSchema/size"

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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingSize: Size | null
  onSubmit: (values: SizeFormValues) => Promise<void>
  isSaving: boolean
}

export default function SizeFormDialog({
  open,
  onOpenChange,
  editingSize,
  onSubmit,
  isSaving,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SizeFormValues>({
    resolver: zodResolver(sizeSchema),
    defaultValues: initialSizeValues,
  })

  // Populate form when editing, reset when creating
  useEffect(() => {
    if (!open) return

    if (editingSize) {
      reset({
        name: editingSize.name,
      })
    } else {
      reset(initialSizeValues)
    }
  }, [open, editingSize, reset])

  const handleFormSubmit: SubmitHandler<SizeFormValues> = async (
    values
  ) => {
    await onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {editingSize ? "Edit Size" : "Create Size"}
          </DialogTitle>

          <DialogDescription>
            {editingSize
              ? "Update the size name."
              : "Add a new reusable garment size to your organization."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1">
            <FormField
              id="name"
              label="Size Name"
              placeholder="e.g. XS, S, M, L, XL, XXL"
              register={register}
              errors={errors}
            />

            <p className="text-xs text-muted-foreground">
              Enter a size name used across your garment bundles.
            </p>
          </div>

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

              {editingSize ? "Save Changes" : "Create Size"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
