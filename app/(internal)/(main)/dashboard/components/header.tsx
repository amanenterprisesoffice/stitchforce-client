import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"
import { CalendarDays, RefreshCw } from "lucide-react"

export default function DashboardHeader({
  today,
  refreshDashboard,
  isDashboardLoading,
  isProductionLoading,
  isPaymentsLoading,
  isWorkersLoading,
}: {
  today: string
  refreshDashboard: () => void
  isDashboardLoading: boolean
  isProductionLoading: boolean
  isPaymentsLoading: boolean
  isWorkersLoading: boolean
}) {
  return <PageHeader 
    title="Dashboard"
    description="Here's what's happening in your factory."
    action={
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          {today}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={refreshDashboard}
          disabled={
            isDashboardLoading ||
            isProductionLoading ||
            isPaymentsLoading ||
            isWorkersLoading
          }
          title="Refresh dashboard"
        >
          <RefreshCw
            className={`size-4 ${isDashboardLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    }
  />
}
