"use client"

import { Plus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/ui/PageHeader"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

interface Props {
  count: number
  onInvite: () => void
}

export default function UsersHeader({ count, onInvite }: Props) {
  const { hasPermission } = usePermissions()

  const canManageUsers = hasPermission(PERMISSIONS.USERS_MANAGE)

  return (
    <PageHeader
      title="Users"
      description=""
      icon={<Users className="size-5 text-muted-foreground" />}
      badge={<Badge variant="secondary">{count}</Badge>}
      action={
        canManageUsers ? (
          <Button onClick={onInvite}>
            <Plus className="size-4" />
            Add User
          </Button>
        ) : undefined
      }
    />
  )
}