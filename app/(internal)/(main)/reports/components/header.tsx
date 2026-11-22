
"use client"

import { FileArchive, Info } from "lucide-react"

import PageHeader from "@/components/ui/PageHeader"
import { Badge } from "@/components/ui/badge"

interface ReportsHeaderProps {
  count: number
}

export default function ReportsHeader({ count }: ReportsHeaderProps) {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Reports"
        description="View and download your monthly archive reports."
        icon={<FileArchive className="size-5 text-muted-foreground" />}
        badge={
          <Badge variant="secondary" className="gap-1.5">
            {count} {count === 1 ? "report" : "reports"}
          </Badge>
        }
      />

      <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

        <div className="space-y-1">
          <p className="text-sm font-medium">
            Important: Report retention policy
          </p>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Monthly reports are generated from your operational data.
            Operational data is retained for 6 months. Generated reports
            are automatically deleted 12 months after their generation
            date. Please download and securely store any reports you
            need to keep beyond this period.
          </p>
        </div>
      </div>
    </div>
  )
}
