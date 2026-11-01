"use client"

import { useEffect, useState } from "react"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type {
  Bundle,
  BundleAttribute,
  BundleFormValues,
} from "@/utils/zodSchema/bundle"

import { bundleSchema, initialBundleValues } from "@/utils/zodSchema/bundle"

import type { Style } from "@/utils/zodSchema/style"
import type { Size } from "@/utils/zodSchema/size"

import FormField from "@/components/ui/FormField"
import { Button } from "@/components/ui/button"

import DynamicAttributeFields, {
  type DynamicField,
} from "@/components/ui/DynamicAttributeFields"

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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingBundle: Bundle | null
  styles: Style[]
  sizes: Size[]
  onSubmit: (values: BundleFormValues) => Promise<void>
  isSaving: boolean
}

export default function BundleFormDialog({
  open,
  onOpenChange,
  editingBundle,
  styles,
  sizes,
  onSubmit,
  isSaving,
}: Props) {
  const [attributes, setAttributes] = useState<DynamicField[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<BundleFormValues>({
    resolver: zodResolver(bundleSchema),
    defaultValues: initialBundleValues,
  })

  // Populate form when editing, reset when creating
  useEffect(() => {
    if (!open) return

    if (editingBundle) {
      reset({
        bundle_number: editingBundle.bundle_number,
        style_id: editingBundle.style_id,
        size_id: editingBundle.size_id,
        quantity: editingBundle.quantity,
        attributes: editingBundle.attributes || {},
        remarks: editingBundle.remarks || "",
      })

      const existingAttributes = editingBundle.attributes || {}

      setAttributes(
        Object.entries(existingAttributes).map(([key, value]) => ({
          key,
          value: String(value),
        }))
      )
    } else {
      reset(initialBundleValues)
      setAttributes([])
    }
  }, [open, editingBundle, reset])

  // Convert dynamic fields into an object
  const handleAttributesChange = (nextAttributes: DynamicField[]) => {
    setAttributes(nextAttributes)

    const attributeObject: Record<string, string> = {}

    nextAttributes.forEach(({ key, value }) => {
      const normalizedKey = key.trim()

      if (normalizedKey) {
        attributeObject[normalizedKey] = value
      }
    })

    setValue("attributes", attributeObject, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handleFormSubmit: SubmitHandler<BundleFormValues> = async (values) => {
    await onSubmit(values)
  }

  const selectClass =
    "h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingBundle ? "Edit Bundle" : "Create Bundle"}
          </DialogTitle>

          <DialogDescription>
            {editingBundle
              ? "Update the bundle and its manufacturing details."
              : "Create a new garment bundle for your organization."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* Bundle number */}
          <FormField
            id="bundle_number"
            label="Bundle Number"
            placeholder="e.g. BND-001"
            register={register}
            errors={errors}
          />

          {/* Style */}
          <FormSelect
            id="style_id"
            label="Style"
            placeholder="Select a style"
            control={control}
            register={register}
            errors={errors}
            options={styles.map((style) => ({
              value: style.id,
              label: style.style_number
                ? `${style.style_number} - ${style.name}`
                : style.name,
            }))}
          />

          {/* Size */}
          <FormSelect
            id="size_id"
            label="Size"
            placeholder="Select a size"
            control={control}
            register={register}
            errors={errors}
            options={sizes.map((size) => ({
              value: size.id,
              label: size.name,
            }))}
          />

          {/* Quantity */}
          <FormField
            id="quantity"
            label="Quantity"
            placeholder="Enter garment quantity"
            register={register}
            registerOptions={{ valueAsNumber: true }}
            errors={errors}
            type="number"
            step={1}
          />

          {/* Dynamic Attributes */}
          <DynamicAttributeFields
            title="Manufacturing Attributes"
            description="Add optional custom attributes to this bundle."
            fields={attributes}
            onChange={handleAttributesChange}
            keyPlaceholder="Attribute name"
            valuePlaceholder="Attribute value"
            addButtonLabel="Add"
            emptyMessage="No attributes added yet."
          />

          {/* Remarks */}
          <FormField
            id="remarks"
            label="Remarks"
            placeholder="Additional bundle notes..."
            register={register}
            errors={errors}
            isTextArea
            rows={3}
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

            <Button
              type="submit"
              disabled={isSaving || styles.length === 0 || sizes.length === 0}
            >
              {isSaving && <Loader />}

              {editingBundle ? "Save Changes" : "Create Bundle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
