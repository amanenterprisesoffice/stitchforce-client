
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import {
  ClipboardList,
  CreditCard,
  Download,
} from "lucide-react"

import {
  QuickLinks,
  QuickLinkItem,
} from "@/components/ui/quick-links"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import WorkerExportDialog from "./export-dialog"


const WorkerQuickLinks = ({
  worker,
}: {
  worker: GarmentWorker
}) => {
  const router = useRouter()

  const [activeExport, setActiveExport] = useState<
    "production" | "payments" | null
  >(null)

  const handleViewEntries = ({ queryParams }: { queryParams?: Record<string, string> }) => {
    const queryString = new URLSearchParams({
      worker_id: worker.id,
      ...queryParams,
    }).toString()
    router.push(
      `/production-entries?${queryString}`
    )
  }

  const handleViewPayments = () => {
    router.push(
      `/worker-payments?worker_id=${worker.id}`
    )
  }

  return (
    <>
      <QuickLinks className="h-fit!">
        <QuickLinkItem
          icon={<ClipboardList className="size-5" />}
          title="View production entries"
          description="See all production records for this worker."
          onClick={() => handleViewEntries({ queryParams: { status: "all" } })}
        />

        <QuickLinkItem
          icon={<ClipboardList className="size-5" />}
          title="View pending payment entries"
          description="See all production records for this worker."
          onClick={() => handleViewEntries({ queryParams: { status: "pending" } })}
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
          onClick={() => setActiveExport("production")}
        />

        <QuickLinkItem
          icon={<Download className="size-5" />}
          title="Download payment history"
          description="Export the worker's payment history."
          onClick={() => setActiveExport("payments")}
        />

      
      </QuickLinks>

      {/* Production entries export */}
      <WorkerExportDialog
        open={activeExport === "production"}
        onOpenChange={(open) =>
          setActiveExport(open ? "production" : null)
        }
        title="Download production entries"
        description="Choose a format to export production entries for"
        endpoint="/production-entries/export"
        workerName={worker.name}
        workerID={worker.id}
      />

      {/* Worker payments export */}
      <WorkerExportDialog
        open={activeExport === "payments"}
        onOpenChange={(open) =>
          setActiveExport(open ? "payments" : null)
        }
        title="Download payment history"
        description="Choose a format to export payment history for"
        endpoint="/worker-payments/export"
        workerName={worker.name}
        workerID={worker.id}
      />
    </>
  )
}

export default WorkerQuickLinks
