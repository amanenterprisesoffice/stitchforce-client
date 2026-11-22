"use client"

import { useState } from "react"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"

import DataTable from "@/components/ui/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { formatDate } from "@/utils/utils"
import type { Report } from "@/utils/types/reports"
import Loader from "@/components/ui/Loader"
import { useRouter } from "next/navigation"

const PAGE_SIZE = 10

interface Props {
  reports: Report[]
  organizationID: string
  onPageChange: (offset: number) => void
  isLoading: boolean
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

function getMonthName(month: number) {
  return new Date(2000, month - 1).toLocaleString("en-IN", {
    month: "long",
  })
}

function getDownloadURL(response: unknown): string {
  if (typeof response === "string") return response

  if (response && typeof response === "object") {
    const result = response as Record<string, any>

    return (
      result.download_url ??
      result.url ??
      result.data?.download_url ??
      result.data?.url ??
      ""
    )
  }

  return ""
}

export default function ReportsTable({
  reports,
  organizationID,
  onPageChange,
  isLoading,
}: Props) {
  const [page, setPage] = useState(0)
  const router = useRouter()
  const [downloadingID, setDownloadingID] = useState<string | null>(null)

  const { refetch: fetchDownloadURL } = useFetch<unknown>({
    auto: false,
    showErrorToast: true,
  })

  const handleDownload = async (report: Report) => {
    setDownloadingID(report.id)

    try {
      await fetchDownloadURL({
        url: `/api/organizations/${organizationID}/reports/${report.id}/download`,
        onSuccess: (response) => {
          const url = getDownloadURL(response)

          if (!url) {
            toast.error("Could not retrieve the report download URL")
            return
          }

          window.location.assign(url)
        },
        onError: () => {
          toast.error("Failed to download report")
        },
      })
    } finally {
      setDownloadingID(null)
    }
  }

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0) return

    setPage(nextPage)
    onPageChange(nextPage * PAGE_SIZE)
  }

  const columns = [
    {
      header: "Report",
      render: (item: Report) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 space-y-1">
            <p className="font-medium">
              {getMonthName(item.month)} {item.year}
            </p>
            <p className="text-sm text-muted-foreground">Monthly archive</p>
          </div>
        </div>
      ),
    },
    {
      header: "Records",
      render: (item: Report) => (
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(item.record_counts ?? {}).map(([key, count]) => (
            <Badge key={key} variant="secondary">
              {key.replaceAll("_", " ")}: {count}
            </Badge>
          ))}

          {Object.keys(item.record_counts ?? {}).length === 0 && (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      header: "File size",
      className: "whitespace-nowrap",
      render: (item: Report) => (
        <span className="text-sm">{formatFileSize(item.file_size)}</span>
      ),
    },
    {
      header: "Generated",
      className: "whitespace-nowrap",
      render: (item: Report) => (
        <span className="text-sm">{formatDate(item.created_at)}</span>
      ),
    },
    {
      header: "Expires",
      className: "whitespace-nowrap",
      render: (item: Report) => (
        <span className="text-sm">{formatDate(item.expires_at)}</span>
      ),
    },
    {
      header: "",
      className: "text-right ",
      render: (item: Report) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={downloadingID !== null}
          onClick={(e) => {
            e.stopPropagation()
            handleDownload(item)
          }}
        >
          {downloadingID === item.id ? (
            <Loader />
          ) : (
            <Download className="mr-2 size-4" />
          )}
          Download
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable
        data={reports}
        columns={columns}
        getRowId={(item: Report) => item.id}
        emptyMessage="No reports found."
        isLoading={isLoading}
        onRowClick={(item: Report) => router.push(`/reports/${item.id}`)}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Page {page + 1}</p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={page === 0 || isLoading}
            onClick={() => handlePageChange(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={reports.length < PAGE_SIZE || isLoading}
            onClick={() => handlePageChange(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
