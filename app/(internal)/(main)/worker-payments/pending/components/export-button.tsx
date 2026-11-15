"use client"

import { useState } from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import ExportDialog from "@/components/ui/ExportDialog"

interface Props {
  filters: {
    search: string
    workerID: string
    styleID: string
    bundleID: string
    operationID: string
    fromDate: string
    toDate: string
  }
}

export default function WorkerPendingPaymentsExportButton({ filters }: Props) {
  const [open, setOpen] = useState(false)

  const queryParams: Record<string, string> = {}

  if (filters.search) queryParams.search = filters.search
  if (filters.workerID) queryParams.worker_id = filters.workerID
  if (filters.styleID) queryParams.style_id = filters.styleID
  if (filters.bundleID) queryParams.bundle_id = filters.bundleID
  if (filters.operationID) {
    queryParams.style_operation_id = filters.operationID
  }
  if (filters.fromDate) queryParams.from_date = filters.fromDate
  if (filters.toDate) queryParams.to_date = filters.toDate

  console.log(queryParams)
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
        endpoint="/worker-payments/balances/export"
        queryParams={queryParams}
      />
    </>
  )
}
