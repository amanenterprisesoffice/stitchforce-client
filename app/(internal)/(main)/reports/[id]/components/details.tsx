"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { formatDate } from "@/utils/utils"
import type { Report } from "@/utils/types/reports"

interface Props {
  report: Report
}

function formatFileSize(bytes: number) {
  if (bytes <= 0) return "—"

  if (bytes < 1024) return `${bytes} B`

  const units = ["KB", "MB", "GB"]
  let size = bytes / 1024
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

export default function ReportDetails({ report }: Props) {
  const recordCounts = Object.entries(report.record_counts ?? {})

  return (
    <div className="space-y-6">
      <Card className="w-full min-w-0">
        <CardHeader>
          <CardTitle className="text-base">Report information</CardTitle>
          <CardDescription>
            Details about this monthly archive report.
          </CardDescription>
        </CardHeader>

        <CardContent className="w-full min-w-0">
          <div className="grid w-full min-w-0 grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-3">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Report ID</p>
              <p className="mt-1 break-all font-mono text-xs">
                {report.id}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Report type</p>
              <p className="mt-1 font-medium capitalize">
                {report.type.replaceAll("_", " ")}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Archive period</p>
              <p className="mt-1 font-medium">
                {new Date(2000, report.month - 1).toLocaleString("en-IN", {
                  month: "long",
                })}{" "}
                {report.year}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">File size</p>
              <p className="mt-1 font-medium">
                {formatFileSize(report.file_size)}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Generated at</p>
              <p className="mt-1 font-medium">
                {formatDate(report.created_at)}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Archived at</p>
              <p className="mt-1 font-medium">
                {formatDate(report.archived_at)}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Expires at</p>
              <p className="mt-1 font-medium">
                {formatDate(report.expires_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full min-w-0">
        <CardHeader>
          <CardTitle className="text-base">Record counts</CardTitle>
          <CardDescription>
            Number of records included in this archive.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {recordCounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No record count information available.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-3">
              {recordCounts.map(([key, count]) => (
                <div key={key} className="min-w-0">
                  <p className="text-sm capitalize text-muted-foreground">
                    {key.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">
                    {count.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}