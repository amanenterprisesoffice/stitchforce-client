
"use client"

import { useCallback, useEffect, useMemo } from "react"
import { FileArchive } from "lucide-react"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"

import ReportsHeader from "./components/header"
import ReportsTable from "./components/table"

import type { Report } from "@/utils/types/reports"

const PAGE_SIZE = 50

export default function ReportsPage() {
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

  const loadReports = useCallback(
    (limit = PAGE_SIZE, offset = 0) => {
      if (!organizationID) return

      fetchReports({
        url: `/api/organizations/${organizationID}/reports?limit=${limit}&offset=${offset}`,
      })
    },
    [organizationID, fetchReports]
  )

  useEffect(() => {
    loadReports()
  }, [loadReports])

  const reports = useMemo(() => data ?? [], [data])

  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col gap-5 p-4 md:p-6">
      <ReportsHeader count={reports.length} />

      <div className="relative h-full min-w-0">
        {isLoading && !data ? (
          <Loader text="Loading reports" />
        ) : error ? (
          <StateComponent
            message={error}
            description="An error occurred while loading reports."
            ICON={<FileArchive />}
            PortalButton={
              <Button
                variant="outline"
                onClick={() => loadReports()}
              >
                Try again
              </Button>
            }
          />
        ) : reports.length === 0 ? (
          <StateComponent
            message="No reports available"
            description="Monthly archive reports will appear here when they are generated."
            ICON={<FileArchive />}
          />
        ) : (
          <ReportsTable
            reports={reports}
            organizationID={organizationID!}
            onPageChange={(offset) => loadReports(PAGE_SIZE, offset)}
            isLoading={isLoading}
          />
        )}
      </div>
    </main>
  )
}
