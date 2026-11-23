"use client"

import { useState } from "react"
import {
  CalendarDays,
  Clock,
  Settings2,
} from "lucide-react"

import type { Organization, WorkerPaymentCycle } from "@/utils/types/organization"
import { WORKER_PAYMENT_CYCLE_OPTIONS } from "@/utils/types/organization"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import EditWorkerPaymentScheduleDialog from "./edit-payment-dialog"


interface Props {
  organization: Organization
  onUpdate: (cycle: WorkerPaymentCycle) => Promise<void>
  isSaving: boolean
}

export default function WorkerPaymentScheduleSection({
  organization,
  onUpdate,
  isSaving,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const currentCycle =
    WORKER_PAYMENT_CYCLE_OPTIONS.find(
      (option) => option.value === organization.worker_payment_cycle
    )

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 border-b">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="size-4" />
              Worker Payment Schedule
            </CardTitle>

            <CardDescription>
              Configure how frequently your organization pays its workers.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            <Settings2 className="mr-2 size-4" />
            Edit
          </Button>
        </CardHeader>

        <CardContent className="py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="size-5 text-primary" />
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-sm text-muted-foreground">
                Current payment frequency
              </p>

              <p className="font-semibold">
                {currentCycle?.label || "Not configured"}
              </p>

              <p className="text-xs text-muted-foreground">
                Worker payment periods are determined automatically using
                this schedule.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditWorkerPaymentScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        organization={organization}
        isSaving={isSaving}
        onSubmit={async (cycle) => {
          await onUpdate(cycle)
          setDialogOpen(false)
        }}
      />
    </>
  )
}