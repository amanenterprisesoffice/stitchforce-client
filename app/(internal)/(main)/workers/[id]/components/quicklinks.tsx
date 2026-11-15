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

import type { GarmentWorker } from "@/utils/types/garmentWorker"
import ExportDialog from "@/components/ui/ExportDialog"

const WorkerQuickLinks = ({
  worker,
}: {
  worker: GarmentWorker
}) => {
  const router = useRouter()

  const [activeExport, setActiveExport] = useState<
    "production" | "payments" | null
  >(null)

  const handleViewEntries = ({
    queryParams,
  }: {
    queryParams?: Record<string, string>
  }) => {
    const params = new URLSearchParams({
      worker_id: worker.id,
      ...queryParams,
    })

    router.push(`/production-entries?${params.toString()}`)
  }

  const handleViewPayments = () => {
    router.push(`/worker-payments?worker_id=${worker.id}`)
  }

  return (
    <>
      <QuickLinks className="h-fit!">
        <QuickLinkItem
          icon={<ClipboardList className="size-5" />}
          title="View production entries"
          description="See all production records for this worker."
          onClick={() =>
            handleViewEntries({ queryParams: { status: "all" } })
          }
        />

        <QuickLinkItem
          icon={<ClipboardList className="size-5" />}
          title="View pending payment entries"
          description="See all pending production records for this worker."
          onClick={() =>
            handleViewEntries({ queryParams: { status: "payable" } })
          }
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

      <ExportDialog
        open={activeExport === "production"}
        onOpenChange={(open) =>
          setActiveExport(open ? "production" : null)
        }
        title="Download production entries"
        description={`Choose a format to export production entries for ${worker.name}.`}
        endpoint="/production-entries/export"
        queryParams={{ worker_id: worker.id }}
      />

      <ExportDialog
        open={activeExport === "payments"}
        onOpenChange={(open) =>
          setActiveExport(open ? "payments" : null)
        }
        title="Download payment history"
        description={`Choose a format to export payment history for ${worker.name}.`}
        endpoint="/worker-payments/export"
        queryParams={{ worker_id: worker.id }}
      />
    </>
  )
}

export default WorkerQuickLinks