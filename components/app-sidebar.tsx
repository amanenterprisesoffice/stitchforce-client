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
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  LayoutDashboardIcon,
  FactoryIcon,
  UsersIcon,
  LayoutDashboard,
} from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { Separator } from "./ui/separator"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
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
    {
      title: "Reports",
      url: "#",
      icon: <PieChartIcon />,
      items: [
        {
          title: "Worker Earnings",
          url: "/reports/worker-earnings",
        },
        {
          title: "Production Reports",
          url: "/reports/production",
        },
        {
          title: "Payment History",
          url: "/reports/payments",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "#",
      icon: <LayoutDashboard />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser() // Get user from context

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
