
"use client"

import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  operationSchema,
  initialOperationValues,
  type OperationFormValues,
  type OperationPayload,
} from "../schema"

import type { StyleOperation } from "./table"

import FormField from "@/components/ui/FormField"
import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/Loader"

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
  editingOperation: StyleOperation | null
  onSubmit: (values: OperationPayload) => Promise<void>
  isSaving: boolean
}

export default function OperationFormDialog({
  open,
  onOpenChange,
  editingOperation,
  onSubmit,
  isSaving,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OperationFormValues, unknown, OperationPayload>({
    resolver: zodResolver(operationSchema),
    defaultValues: initialOperationValues,
  })

  useEffect(() => {
    if (!open) return

    if (editingOperation) {
      reset({
        name: editingOperation.name,
        rate_per_piece: (
          Number(editingOperation.rate_per_piece) / 100
        ).toFixed(2),
      })
    } else {
      reset(initialOperationValues)
    }
  }, [open, editingOperation, reset])

  const handleFormSubmit: SubmitHandler<OperationPayload> =
    async (values) => {
      await onSubmit(values)
    }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {editingOperation ? "Edit Operation" : "Add Operation"}
          </DialogTitle>

          <DialogDescription>
            {editingOperation
              ? "Update this manufacturing operation and its rate."
              : "Add a manufacturing operation to this style."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <FormField
            id="name"
            label="Operation Name"
            placeholder="e.g. Collar Stitching"
            register={register}
            errors={errors}
          />

          <div className="space-y-1">
            <FormField
              id="rate_per_piece"
              label="Rate Per Piece (₹)"
              placeholder="e.g. 3.50"
              register={register}
              errors={errors}
              type="number"
              step="0.01"
            />

            <p className="text-xs text-muted-foreground">
              Amount earned by a worker for completing one piece
              of this operation.
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

              {editingOperation
                ? "Save Changes"
                : "Create Operation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
