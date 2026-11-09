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
import { Separator } from "./ui/separator"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Production",
      url: "#",
      icon: <FactoryIcon />,
      items: [
        {
          title: "Styles",
          url: "/styles",
        },
        {
          title: "Bundles",
          url: "/bundles",
        },
        {
          title: "Sizes",
          url: "/sizes",
        },
        {
          title: "Entries",
          url: "/production-entries",
        },
      ],
    },
    {
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
    },
    {
      title: "People",
      url: "#",
      icon: <UsersIcon />,
      items: [
        {
          title: "Garment Workers",
          url: "/workers",
        },
        {
          title: "Users",
          url: "/users",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationHeader />
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
