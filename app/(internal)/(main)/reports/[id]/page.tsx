"use client"

import { useCallback, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { FileArchive } from "lucide-react"

import { useUser } from "@/contexts/UserContext"
import useFetch from "@/hooks/useFetch"

import Loader from "@/components/ui/Loader"
import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"

import ReportHeader from "./components/header"
import ReportDetails from "./components/details"

import type { Report } from "@/utils/types/reports"

export default function ReportDetailsPage() {
  const params = useParams()
  const reportID = params.id as string

  const { user } = useUser()
  const organizationID = user?.organization_id

  const {
    data,
    isLoading,
    error,
    refetch: fetchReports,
  } = useFetch<Report[]>({
    auto: false,
  })

  const loadReports = useCallback(() => {
    if (!organizationID) return

    fetchReports({
      url: `/api/organizations/${organizationID}/reports?limit=50&offset=0`,
    })
  }, [organizationID, fetchReports])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  const report = useMemo(
    () => data?.find((item) => item.id === reportID) ?? null,
    [data, reportID]
  )

  if (isLoading && !data) {
    return (
      <main className="mx-auto flex h-full w-full max-w-7xl flex-col p-4 md:p-6">
        <Loader text="Loading report" />
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto flex h-full w-full max-w-7xl flex-col p-4 md:p-6">
        <StateComponent
          message={error}
          description="An error occurred while loading this report."
          ICON={<FileArchive />}
          PortalButton={
            <Button variant="outline" onClick={loadReports}>
              Try again
            </Button>
          }
        />
      </main>
    )
  }

  if (!report) {
    return (
      <main className="mx-auto flex h-full w-full max-w-7xl flex-col p-4 md:p-6">
        <StateComponent
          message="Report not found"
          description="This report may have expired or may no longer be available."
          ICON={<FileArchive />}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <ReportHeader
        report={report}
        organizationID={organizationID!}
      />

      <ReportDetails report={report} />
    </main>
  )
}