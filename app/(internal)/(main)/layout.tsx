"use client"

import { AppSidebar } from "@/components/app-sidebar"
import AutoBreadcrumbs from "@/components/ui/AutoBreadCrumps"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { Icon, PanelLeftIcon, Plus, PlusCircle, Wallet } from "lucide-react"
import Link from "next/link"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <AutoBreadcrumbs />
          </div>
          <TopNav />
        </header>
        <div className="flex flex-1 flex-col gap-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayout

const TopNav = () => {
  const topLinks = [
    { title: "Payments", href: "/worker-payments", Icon: Wallet },
    {
      title: "Add Production Entry",
      href: "/production-entries/new",
      Icon: PlusCircle,
    },
  ]

  return (
    <TooltipProvider>
      <nav className="flex items-center gap-4">
        {topLinks.map(({ title, Icon, href }) => (
          <Tooltip key={href}>
            <TooltipTrigger
              render={
                <Link
                  href={href}
                  aria-label={title}
                  className="flex items-center justify-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {Icon && <Icon size={18} />}
                </Link>
              }
            />

            <TooltipContent side="bottom">{title}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </TooltipProvider>
  )
}
