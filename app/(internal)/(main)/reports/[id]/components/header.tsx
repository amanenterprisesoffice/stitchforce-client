"use client"

import { useState } from "react"
import { Download, FileArchive } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"

import PageHeader from "@/components/ui/PageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Loader from "@/components/ui/Loader"

import type { Report } from "@/utils/types/reports"

interface Props {
  report: Report
  organizationID: string
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

function getMonthName(month: number) {
  return new Date(2000, month - 1).toLocaleString("en-IN", {
    month: "long",
  })
}

export default function ReportHeader({
  report,
  organizationID,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false)

  const { refetch: fetchDownloadURL } = useFetch<unknown>({
    auto: false,
    showErrorToast: true,
  })

  const handleDownload = async () => {
    setIsDownloading(true)

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
      setIsDownloading(false)
    }
  }

  return (
    <PageHeader
      title={`${getMonthName(report.month)} ${report.year} Report`}
      description="Monthly archive report details."
      icon={<FileArchive className="size-5 text-muted-foreground" />}
      badge={<Badge variant="secondary">Monthly archive</Badge>}
      action={
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader />
          ) : (
            <Download className="mr-2 size-4" />
          )}
          Download report
        </Button>
      }
    />
  )
}