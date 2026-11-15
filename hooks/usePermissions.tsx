"use client"

import { Permission } from "@/constants/permissions"
import { useUser } from "@/contexts/UserContext"

export function usePermissions() {
  const { user } = useUser()

  const permissions: string[] = user?.permissions ?? []

  const hasPermission = (permission: Permission) => {
    return permissions.includes(permission)
  }

  const hasAnyPermission = (required: Permission[]) => {
    return required.some((permission) =>
      permissions.includes(permission)
    )
  }

  const hasAllPermissions = (required: Permission[]) => {
    return required.every((permission) =>
      permissions.includes(permission)
    )
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }
}