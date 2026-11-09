"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CalendarDays, ClipboardList, Clock } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import StateComponent from "@/components/StateComponent"

import { Bundle, BundleStatus, STATUS_LABELS } from "@/utils/zodSchema/bundle"
import { Style } from "@/utils/zodSchema/style"
import { Size } from "@/utils/zodSchema/size"

import BundleDetailsHeader from "./components/header"
import BundleTimeline from "./components/timeline"
import BundleQuickLinks from "./components/quick-links"
import BundleSummary from "./components/summary"
import ManufacturingAttributes from "./components/manufacturing-atts"
import BundleOperationsTable from "./components/operations-table"
import { formatDate } from "@/utils/utils"

function readAttributes(value: Bundle["attributes"]): Record<string, unknown> {
  if (!value) return {}

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)

      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : {}
    } catch {
      return {}
    }
  }

  return typeof value === "object" && !Array.isArray(value) ? value : {}
}

export default function BundleDetailsPage() {
  const params = useParams()
  const bundleID = params.id as string

  const { user } = useUser()
  const organizationID = user?.organization_id

  const [bundle, setBundle] = useState<Bundle | null>(null)
  const [style, setStyle] = useState<Style | null>(null)
  const [sizes, setSizes] = useState<Size[]>([])

  const bundleURL =
    organizationID && bundleID
      ? `/api/organizations/${organizationID}/bundles/${bundleID}`
      : ""

  const { refetch: fetchBundle, isLoading: bundleLoading } = useFetch({
    auto: false,
    onSuccess: (result: any) => {
      setBundle(result?.bundle ?? result?.data ?? result)
    },
  })

  const { refetch: fetchStyle, isLoading: styleLoading } = useFetch({
    auto: false,
    onSuccess: (result: any) => {
      setStyle(result?.style ?? result?.data ?? result)
    },
  })

  const { refetch: fetchSizes } = useFetch({
    auto: false,
    onSuccess: (result: any) => {
      const list = Array.isArray(result)
        ? result
        : (result?.sizes ?? result?.data ?? [])

      setSizes(Array.isArray(list) ? list : [])
    },
  })

  const { refetch: updateStatus, isLoading: isUpdatingStatus } = useFetch({
    auto: false,
  })

  useEffect(() => {
    if (!organizationID || !bundleID) return

    fetchBundle({
      url: bundleURL,
      method: "GET",
    })

    fetchSizes({
      url: `/api/organizations/${organizationID}/sizes`,
      method: "GET",
    })
  }, [organizationID, bundleID])

  useEffect(() => {
    if (!organizationID || !bundle?.style_id) return

    fetchStyle({
      url: `/api/organizations/${organizationID}/styles/${bundle.style_id}`,
      method: "GET",
    })
  }, [organizationID, bundle?.style_id])

  const attributes = useMemo(
    () => readAttributes(bundle?.attributes ?? {}),
    [bundle?.attributes]
  )

  const sizeName =
    sizes.find((size) => size.id === bundle?.size_id)?.name ||
    bundle?.size_id ||
    "—"

  const currentStatus = bundle?.status || "created"

  const handleStatusUpdate = async (targetStatus: BundleStatus) => {
    if (!bundleURL || !bundle) return

    await updateStatus({
      url: bundleURL,
      method: "PUT",
      payload: { status: targetStatus },
      onSuccess: (result: any) => {
        const updated = result?.bundle ?? result?.data ?? result

        setBundle((current) =>
          current
            ? {
                ...current,
                ...(updated && typeof updated === "object" ? updated : {}),
                status: targetStatus,
              }
            : current
        )

        toast.success(`Bundle status updated to ${STATUS_LABELS[targetStatus]}`)
      },
    })
  }

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Error"
        description="Something went wrong."
        PortalButton={
          <Button variant="outline" render={<Link href="/bundles" />}>
            Back to bundles
          </Button>
        }
      />
    )
  }

  if (bundleLoading && !bundle) {
    return <Loader text="Loading bundle details" />
  }

  if (!bundle) {
    return (
      <StateComponent
        message="Bundle not found"
        description="The bundle may have been deleted or you may not have access to it."
        PortalButton={
          <Button variant="outline" render={<Link href="/bundles" />}>
            Back to bundles
          </Button>
        }
      />
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 md:p-6">
      <BundleDetailsHeader
        bundle={bundle}
        style={style}
        styleLoading={styleLoading}
      />

      {/* Bundle information */}
      <BundleSummary
        bundle={bundle}
        style={style}
        sizeName={sizeName}
        operationCount={bundle.operations?.length ?? 0}
      />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_30%]">
        <BundleOperationsTable
          operations={bundle.operations ?? []}
          quantity={bundle.quantity}
          isLoading={bundleLoading}
        />
        <ManufacturingAttributes attributes={bundle.attributes} />
      </div>

      {/* Production status */}
      <BundleTimeline
        status={currentStatus}
        isUpdating={isUpdatingStatus}
        onAdvance={handleStatusUpdate}
      />

      {/* Quick links */}
      <BundleQuickLinks bundle={bundle} />
      {/* Metadata Footer */}
      <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          <span>Created:</span>
          <span className="font-medium text-foreground/80">
            {formatDate(bundle.created_at)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          <span>Updated:</span>
          <span className="font-medium text-foreground/80">
            {formatDate(bundle.updated_at)}
          </span>
        </div>
      </div>
    </main>
  )
}
