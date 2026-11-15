"use client"

import { useState } from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import ExportDialog from "@/components/ui/ExportDialog"
import { WorkerPaymentFiltersValue } from "./filters"

export default function WorkerPaymentsExportButton({
  filters,
}: {
  filters: WorkerPaymentFiltersValue
}) {
  const [open, setOpen] = useState(false)

  const queryParams: Record<string, string> = {}

  if (filters.worker_id) queryParams.worker_id = filters.worker_id
  if (filters.status) queryParams.status = filters.status
  if (filters.from_date) queryParams.from_date = filters.from_date
  if (filters.to_date) queryParams.to_date = filters.to_date
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Download className="mr-2 size-4" />
        Export
      </Button>

      <ExportDialog
        open={open}
        onOpenChange={setOpen}
        title="Export pending worker payments"
        description="Choose a format to export pending worker balances using the currently applied filters."
        endpoint="/worker-payments/export"
        queryParams={queryParams}
      />
    </>
  )
}
