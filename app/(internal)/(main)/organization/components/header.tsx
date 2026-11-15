"use client"

import { Building2, Pencil, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"
import type { Organization } from "@/utils/types/organization"
import { getInitials } from "@/utils/utils"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"
import { useUser } from "@/contexts/UserContext"

interface Props {
  organization: Organization
  onEdit: () => void
  onDelete: () => void
}

export default function OrganizationHeader({
  organization,
  onEdit,
  onDelete,
}: Props) {
  const { hasPermission } = usePermissions()
  const { isOrgAdmin } = useUser()

  const canUpdate = hasPermission(PERMISSIONS.ORGANIZATION_UPDATE)
  const canDelete = isOrgAdmin

  return (
    <PageHeader
      title={organization.name}
      description="Manage your organization details and license."
      icon={
        <Avatar className="size-12 shrink-0 sm:size-14">
          <AvatarImage
            src={organization.photo_url || undefined}
            alt={organization.name}
            className="object-cover"
          />
          <AvatarFallback className="text-lg font-semibold">
            {organization.name ? getInitials(organization.name) : <Building2 />}
          </AvatarFallback>
        </Avatar>
      }
      action={
        canUpdate || canDelete ? (
          <div className="flex items-center gap-2">
            {canUpdate && (
              <Button variant="outline" onClick={onEdit}>
                <Pencil className="size-4" />
                Edit organization
              </Button>
            )}

            {canDelete && (
              <Button variant="destructive" onClick={onDelete}>
                <Trash2 className="size-4" />
                Delete
              </Button>
            )}
          </div>
        ) : undefined
      }
    />
  )
}
