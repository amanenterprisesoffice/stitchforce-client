"use client"

import PageHeader from "@/components/ui/PageHeader"
import { Shirt, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Style } from "@/utils/types/style"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

const StyleHeader = ({
  style,
  openCreateDialog,
}: {
  style: Style | null
  openCreateDialog: () => void
}) => {
  const { hasPermission } = usePermissions()

  const canCreate = hasPermission(PERMISSIONS.STYLES_CREATE)

  if (!style) return null

  return (
    <PageHeader
      title={style.name}
      icon={<Shirt className="size-5 text-muted-foreground" />}
      badge={
        <>
          <Badge variant="outline" className="font-mono">
            {style.style_number}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Style details
          </span>
        </>
      }
      action={
        canCreate ? (
          <div className="flex gap-2">
            <Button onClick={openCreateDialog}>
              <Plus className="size-4" />
              Add Operation
            </Button>
          </div>
        ) : undefined
      }
      description={style.description}
    />
  )
}

export default StyleHeader