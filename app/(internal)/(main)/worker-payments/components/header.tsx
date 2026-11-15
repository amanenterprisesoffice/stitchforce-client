"use client"

import { Plus, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"

import type { WorkerPaymentFiltersValue } from "./filters"
import WorkerPaymentsExportButton from "./export-button"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

interface Props {
  filters: WorkerPaymentFiltersValue
}

export default function WorkerPaymentsHeader({ filters }: Props) {
  const router = useRouter()
  const { hasPermission } = usePermissions()

  const canCreate = hasPermission(PERMISSIONS.PAYMENTS_CREATE)
  const canView = hasPermission(PERMISSIONS.PAYMENTS_VIEW)

  return (
    <PageHeader
      title="Worker payments"
      icon={<Wallet />}
      description="Track payments made to garment workers."
      action={
        <>
          {canView && <WorkerPaymentsExportButton filters={filters} />}

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
