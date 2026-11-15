"use client"

import { Plus, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"
import WorkerPendingPaymentsExportButton from "./export-button"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

interface Filters {
  search: string
  workerID: string
  styleID: string
  bundleID: string
  operationID: string
  fromDate: string
  toDate: string
}

interface Props {
  filters: Filters
}

export default function PendingPaymentsHeader({ filters }: Props) {
  const router = useRouter()
  const { hasPermission } = usePermissions()

  const canCreate = hasPermission(PERMISSIONS.PAYMENTS_CREATE)

  return (
    <PageHeader
      title="Pending Payments"
      icon={<Wallet />}
      description="See which workers have pending payments."
      action={
        <>
          <WorkerPendingPaymentsExportButton filters={filters} />

          {canCreate && (
            <Button onClick={() => router.push("/worker-payments/new")}>
              <Plus className="mr-2 size-4" />
              Record payment
            </Button>
          )}
        </>
      }
    />
  )
}