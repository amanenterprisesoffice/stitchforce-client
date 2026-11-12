"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { FactoryIcon } from "lucide-react"
import type { Organization } from "@/utils/types/organization"
import { getInitials } from "@/utils/utils"

export function OrganizationHeader({
  organization,
}: {
  organization: Organization | null
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          tooltip="StitchForce"
          className="cursor-default hover:bg-transparent active:bg-transparent"
        >
          <Avatar className="size-8 rounded-lg">
            {organization?.photo_url && (
              <AvatarImage
                src={organization.photo_url}
                alt={organization.name}
                className="rounded-lg object-cover"
              />
            )}

            <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {organization?.name ? (
                getInitials(organization.name)
              ) : (
                <FactoryIcon className="size-4" />
              )}
            </AvatarFallback>
          </Avatar>

          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {organization?.name || "StitchForce Organization"}
            </span>

            <span className="truncate text-xs text-muted-foreground">
              Garment Management
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}