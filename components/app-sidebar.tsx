
"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { OrganizationHeader } from "@/components/nav-org"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  LayoutDashboardIcon,
  FactoryIcon,
  UsersIcon,
  PieChartIcon,
} from "lucide-react"

import { useUser } from "@/contexts/UserContext"
import { useOrganization } from "@/contexts/OrganizationContext"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

import { Separator } from "./ui/separator"

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const { organization } = useOrganization()
  const { hasPermission } = usePermissions()

  const navMain = React.useMemo(() => {
    const canViewDashboard = hasPermission(PERMISSIONS.DASHBOARD_VIEW)

    const canViewStyles = hasPermission(PERMISSIONS.STYLES_VIEW)
    const canViewBundles = hasPermission(PERMISSIONS.BUNDLES_VIEW)
    const canViewSizes = hasPermission(PERMISSIONS.SIZES_VIEW)
    const canViewProduction = hasPermission(PERMISSIONS.PRODUCTION_VIEW)

    const canViewPayments = hasPermission(PERMISSIONS.PAYMENTS_VIEW)

    const canViewWorkers = hasPermission(PERMISSIONS.WORKERS_VIEW)
    const canViewUsers = hasPermission(PERMISSIONS.USERS_VIEW)

    const items = []

    if (canViewDashboard) {
      items.push({
        title: "Dashboard",
        url: "/dashboard",
        icon: <LayoutDashboardIcon />,
      })
    }

    const productionItems = [
      ...(canViewStyles
        ? [{ title: "Styles", url: "/styles" }]
        : []),

      ...(canViewBundles
        ? [{ title: "Bundles", url: "/bundles" }]
        : []),

      ...(canViewSizes
        ? [{ title: "Sizes", url: "/sizes" }]
        : []),

      ...(canViewProduction
        ? [{ title: "Entries", url: "/production-entries" }]
        : []),
    ]

    if (productionItems.length > 0) {
      items.push({
        title: "Production",
        url: "#",
        icon: <FactoryIcon />,
        items: productionItems,
      })
    }

    if (canViewPayments) {
      items.push({
        title: "Payments",
        url: "#",
        icon: <PieChartIcon />,
        items: [
          {
            title: "Payment History",
            url: "/worker-payments",
          },
          {
            title: "Pending Payments",
            url: "/worker-payments/pending",
          },
        ],
      })
    }

    const peopleItems = [
      ...(canViewWorkers
        ? [{ title: "Garment Workers", url: "/workers" }]
        : []),

      ...(canViewUsers
        ? [{ title: "Users", url: "/users" }]
        : []),
    ]

    if (peopleItems.length > 0) {
      items.push({
        title: "People",
        url: "#",
        icon: <UsersIcon />,
        items: peopleItems,
      })
    }

    return items
  }, [hasPermission])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationHeader organization={organization} />
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
