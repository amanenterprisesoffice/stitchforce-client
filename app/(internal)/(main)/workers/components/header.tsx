"use client"

import { Plus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

interface Props {
  onCreate: () => void
}

export default function WorkersHeader({ onCreate }: Props) {
  const { hasPermission } = usePermissions()

  const canCreate = hasPermission(PERMISSIONS.WORKERS_CREATE)

  return (
    <PageHeader
      title="Garment Workers"
      description="Manage your workers and their employment status."
      icon={<Users className="size-5 text-muted-foreground" />}
      action={
        canCreate ? (
          <Button onClick={onCreate}>
            <Plus className="size-4" />
            Add Worker
          </Button>
        ) : undefined
      }
    />
  )
}