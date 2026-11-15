"use client"

import { PencilRuler, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

interface Props {
  onCreate: () => void
}

export default function SizesHeader({ onCreate }: Props) {
  const { hasPermission } = usePermissions()

  const canCreate = hasPermission(PERMISSIONS.SIZES_CREATE)

  return (
    <PageHeader
      title="Sizes"
      description="Manage garment sizes and their manufacturing operations."
      icon={<PencilRuler className="size-5 text-muted-foreground" />}
      action={
        canCreate ? (
          <Button onClick={onCreate}>
            <Plus className="size-4" />
            Create Size
          </Button>
        ) : undefined
      }
    />
  )
}