"use client"

import Link from "next/link"
import { Notebook, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

export default function ProductionEntriesHeader() {
  const { hasPermission } = usePermissions()

  const canCreate = hasPermission(PERMISSIONS.PRODUCTION_CREATE)

  return (
    <PageHeader
      title="Production entries"
      description="Record worker output, track bundle progress, and review piece-rate earnings."
      icon={<Notebook />}
      action={
        canCreate ? (
          <Button render={<Link href="/production-entries/new" />}>
            <Plus className="size-4" />
            Add production entries
          </Button>
        ) : undefined
      }
    />
  )
}