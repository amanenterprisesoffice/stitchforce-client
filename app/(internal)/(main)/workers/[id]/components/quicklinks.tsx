"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ClipboardList,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  FileType,
} from "lucide-react"

import { QuickLinks, QuickLinkItem } from "@/components/ui/quick-links"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import FormToggleGroup from "@/components/ui/FormToggleGroup"
import { useUser } from "@/contexts/UserContext"
import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"

type ExportFormat = "csv" | "xlsx" | "pdf"

const EXPORT_OPTIONS = [
  {
    value: "csv",
    label: "CSV",
    icon: FileText,
  },
  {
    value: "xlsx",
    label: "Excel",
    icon: FileSpreadsheet,
  },
  {
    value: "pdf",
    label: "PDF",
    icon: FileType,
  },
]

const WorkerQuickLinks = ({ worker }: { worker: GarmentWorker }) => {
  const router = useRouter()
  const { user } = useUser()

  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv")

  const handleViewEntries = () => {
    router.push(`/production-entries?worker_id=${worker.id}`)
  }

  const handleViewPayments = () => {
    router.push(`/worker-payments?worker_id=${worker.id}`)
  }

  const handleDownloadEntries = () => {
    if (!user?.organization_id) return

    const params = new URLSearchParams({
      format: exportFormat,
      worker_id: worker.id,
    })

    const url = `/api/organizations/${user.organization_id}/production-entries/export?${params.toString()}`

    window.open(url, "_blank")
    setExportDialogOpen(false)
  }

  const handleDownloadPayments = () => {
    router.push(`/workers/${worker.id}/payments/download`)
  }

  return (
    <>
      <QuickLinks className="h-fit!">
        <QuickLinkItem
          icon={<ClipboardList className="size-5" />}
          title="View production entries"
          description="See all production records for this worker."
          onClick={handleViewEntries}
        />

        <QuickLinkItem
          icon={<CreditCard className="size-5" />}
          title="View payments"
          description="See the worker's complete payment history."
          onClick={handleViewPayments}
        />

        <QuickLinkItem
          icon={<Download className="size-5" />}
          title="Download production entries"
          description="Export this worker's production records."
          onClick={() => setExportDialogOpen(true)}
        />

        <QuickLinkItem
          icon={<Download className="size-5" />}
          title="Download payment history"
          description="Export the worker's payment history."
          onClick={handleDownloadPayments}
        />
      </QuickLinks>

      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download production entries</DialogTitle>
            <DialogDescription>
              Choose a format to export production entries for{" "}
              <span className="font-medium text-foreground">
                {worker.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <FormToggleGroup
            name="exportFormat"
            value={exportFormat}
            onChange={(value) =>
              setExportFormat(value as ExportFormat)
            }
            options={EXPORT_OPTIONS}
            type="single"
            ToggleGroupClassName="w-full"
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExportDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleDownloadEntries}
              disabled={!user?.organization_id}
            >
              <Download className="mr-2 size-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WorkerQuickLinks