"use client"

import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { Style, StyleFormValues } from "../../../../../utils/types/style"
import { styleSchema, initialStyleValues } from "../../../../../utils/types/style"

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
  editingStyle: Style | null
  onSubmit: (values: StyleFormValues) => Promise<void>
  isSaving: boolean
}

export default function StyleFormDialog({
  open,
  onOpenChange,
  editingStyle,
  onSubmit,
  isSaving,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StyleFormValues>({
    resolver: zodResolver(styleSchema),
    defaultValues: initialStyleValues,
  })

  // Populate form when editing, reset when creating
  useEffect(() => {
    if (!open) return

    if (editingStyle) {
      reset({
        name: editingStyle.name,
        style_number: editingStyle.style_number,
        description: editingStyle.description || "",
      })
    } else {
      reset(initialStyleValues)
    }
  }, [open, editingStyle, reset])

  const handleFormSubmit: SubmitHandler<StyleFormValues> = async (values) => {
    await onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingStyle ? "Edit Style" : "Create Style"}
          </DialogTitle>

          <DialogDescription>
            {editingStyle
              ? "Update the garment style details."
              : "Add a new garment style to your organization."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            id="name"
            label="Style Name"
            placeholder="e.g. Men's Formal Shirt"
            register={register}
            errors={errors}
          />

          <div className="space-y-1">
            <FormField
              id="style_number"
              label="Style Number"
              placeholder="e.g. ST-001"
              register={register}
              errors={errors}
            />

            <p className="text-xs text-muted-foreground">
              A unique identifier for this garment style.
            </p>
          </div>

          <div className="space-y-1">
            <FormField
              id="description"
              label="Description"
              placeholder="Describe this garment style..."
              register={register}
              errors={errors}
              isTextArea
              rows={4}
            />

            <p className="text-xs text-muted-foreground">Optional</p>
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

              {editingStyle ? "Save Changes" : "Create Style"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
