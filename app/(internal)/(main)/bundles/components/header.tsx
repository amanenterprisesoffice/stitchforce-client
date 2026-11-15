"use client"

import { Package, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

interface Props {
  onCreate: () => void
}

export default function BundlesHeader({ onCreate }: Props) {
  const { hasPermission } = usePermissions()

  const canCreate = hasPermission(PERMISSIONS.BUNDLES_CREATE)

  return (
    <PageHeader
      title="Bundles"
      description="Manage garment bundles, quantities, and manufacturing details."
      icon={<Package className="size-5 text-muted-foreground" />}
      action={
        canCreate ? (
          <Button onClick={onCreate}>
            <Plus className="size-4" />
            Create Bundle
          </Button>
        ) : undefined
      }
    />
  )
}