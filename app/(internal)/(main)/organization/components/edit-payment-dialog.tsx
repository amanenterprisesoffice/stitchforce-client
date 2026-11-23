"use client"

import { useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarDays } from "lucide-react"

import type { Organization, WorkerPaymentCycle } from "@/utils/types/organization"
import { WORKER_PAYMENT_CYCLE_OPTIONS } from "@/utils/types/organization"

import FormSelect from "@/components/ui/FormSelect"
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

const schema = z.object({
  worker_payment_cycle: z.enum([
    "half_monthly",
    "monthly",
    "bi_monthly",
    "quarterly",
    "half_yearly",
    "yearly",
  ]),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  organization: Organization
  onSubmit: (cycle: WorkerPaymentCycle) => Promise<void>
  isSaving: boolean
}

export default function EditWorkerPaymentScheduleDialog({
  open,
  onOpenChange,
  organization,
  onSubmit,
  isSaving,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      worker_payment_cycle: organization.worker_payment_cycle || "half_monthly",
    },
  })

  useEffect(() => {
    if (!open) return

    reset({
      worker_payment_cycle:
        organization.worker_payment_cycle || "half_monthly",
    })
  }, [open, organization.worker_payment_cycle, reset])

  const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
    await onSubmit(values.worker_payment_cycle)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Worker Payment Schedule</DialogTitle>
          <DialogDescription>
            Configure how frequently your organization settles worker
            earnings.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5"
        >
          <FormSelect
            id="worker_payment_cycle"
            label="Payment Frequency"
            control={control}
            errors={errors}
            disabled={isSaving}
            placeholder="Select payment frequency"
            options={WORKER_PAYMENT_CYCLE_OPTIONS}
          />

          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Payment periods will be generated automatically according to
                this schedule. Existing payment records will not be affected
                when you change the frequency.
              </p>
            </div>
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
              Save Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}