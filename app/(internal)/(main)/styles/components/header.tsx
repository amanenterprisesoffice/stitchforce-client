"use client"

import { Plus, ShirtIcon } from "lucide-react"
import PageHeader from "@/components/ui/PageHeader"
import { Button } from "@/components/ui/button"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

interface Props {
  onCreate: () => void
}

export default function StylesHeader({ onCreate }: Props) {
  const { hasPermission } = usePermissions()

  const canCreate = hasPermission(PERMISSIONS.STYLES_CREATE)

  return (
    <PageHeader
      title="Styles"
      description="Manage garment styles and their manufacturing operations."
      icon={<ShirtIcon className="size-5 text-muted-foreground" />}
      action={
        canCreate ? (
          <Button onClick={onCreate}>
            <Plus className="size-4" />
            Create Style
          </Button>
        ) : undefined
      }
    />
  )
}