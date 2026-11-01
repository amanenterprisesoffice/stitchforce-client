"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Package,
  PackageCheck,
  Palette,
  Play,
  Ruler,
  Shirt,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import State from "@/components/StateComponent"

interface Bundle {
  id: string
  organization_id?: string
  bundle_number: string
  style_id: string
  size_id: string
  quantity: number
  attributes?: Record<string, unknown> | string | null
  status: string
  remarks?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

interface Style {
  id: string
  name: string
  style_number?: string
  description?: string
}

interface Size {
  id: string
  name: string
}

type BundleStatus = "created" | "ready" | "in_progress" | "completed"

const STATUS_STEPS: {
  key: BundleStatus
  title: string
  description: string
  actionLabel: string
  icon: React.ElementType
}[] = [
  {
    key: "created",
    title: "Created",
    description: "The bundle has been created and added to production.",
    actionLabel: "",
    icon: Package,
  },
  {
    key: "ready",
    title: "Ready",
    description: "The bundle is prepared and ready for production.",
    actionLabel: "Mark as Ready",
    icon: CheckCircle2,
  },
  {
    key: "in_progress",
    title: "In Progress",
    description: "Production work has started for this bundle.",
    actionLabel: "Start Production",
    icon: Play,
  },
  {
    key: "completed",
    title: "Completed",
    description: "Production for this bundle has been completed.",
    actionLabel: "Mark as Completed",
    icon: PackageCheck,
  },
]

const STATUS_ORDER: Record<BundleStatus, number> = {
  created: 1,
  ready: 2,
  in_progress: 3,
  completed: 4,
}

const STATUS_LABELS: Record<string, string> = {
  created: "Created",
  ready: "Ready",
  in_progress: "In Progress",
  completed: "Completed",
}

function formatDate(value?: string) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function readAttributes(
  value: Bundle["attributes"]
): Record<string, unknown> {
  if (!value) return {}

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)

      return parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
        ? parsed
        : {}
    } catch {
      return {}
    }
  }

  return typeof value === "object" && !Array.isArray(value)
    ? value
    : {}
}

function humanize(value: string) {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function isValidStatus(status: string): status is BundleStatus {
  return status in STATUS_ORDER
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    created: "border-slate-200 bg-slate-100 text-slate-700",
    ready: "border-blue-200 bg-blue-50 text-blue-700",
    in_progress: "border-amber-200 bg-amber-50 text-amber-700",
    completed: "border-green-200 bg-green-50 text-green-700",
  }

  return (
    <Badge
      variant="outline"
      className={
        styles[status] ||
        "border-slate-200 bg-slate-100 text-slate-700"
      }
    >
      {STATUS_LABELS[status] || humanize(status || "unknown")}
    </Badge>
  )
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

  // Fetch bundle
  const {
    refetch: fetchBundle,
    isLoading: bundleLoading,
  } = useFetch({
    auto: false,
    onSuccess: (result: any) => {
      setBundle(result?.bundle ?? result?.data ?? result)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to load bundle")
    },
  })

  // Fetch style
  const {
    refetch: fetchStyle,
    isLoading: styleLoading,
  } = useFetch({
    auto: false,
    onSuccess: (result: any) => {
      setStyle(result?.style ?? result?.data ?? result)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to load style details")
    },
  })

  // Fetch sizes
  const { refetch: fetchSizes } = useFetch({
    auto: false,
    onSuccess: (result: any) => {
      const list = Array.isArray(result)
        ? result
        : result?.sizes ?? result?.data ?? []

      setSizes(Array.isArray(list) ? list : [])
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to load sizes")
    },
  })

  // Update status
  const {
    refetch: updateStatus,
    isLoading: isUpdatingStatus,
  } = useFetch({
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
    () => readAttributes(bundle?.attributes),
    [bundle?.attributes]
  )

  const sizeName =
    sizes.find((size) => size.id === bundle?.size_id)?.name ||
    bundle?.size_id ||
    "—"

  const currentStatus = bundle?.status || "created"

  const currentStatusIndex = isValidStatus(currentStatus)
    ? STATUS_ORDER[currentStatus]
    : 0

  const nextStatusStep = STATUS_STEPS.find(
    (step) => STATUS_ORDER[step.key] === currentStatusIndex + 1
  )

  const isCompleted = currentStatus === "completed"

  // Move only one step forward at a time.
  const handleStatusUpdate = async () => {
    if (!bundleURL || !bundle || !nextStatusStep) return

    const targetStatus = nextStatusStep.key

    await updateStatus({
      url: `${bundleURL}`,
      method: "PUT",
      payload: {
        status: targetStatus,
      },
      onSuccess: (result: any) => {
        const updated = result?.bundle ?? result?.data ?? result

        setBundle((current) =>
          current
            ? {
                ...current,
                ...(updated && typeof updated === "object"
                  ? updated
                  : {}),
                status: targetStatus,
              }
            : current
        )

        toast.success(
          `Bundle status updated to ${STATUS_LABELS[targetStatus]}`
        )
      },
      onError: (error: any) => {
        toast.error(
          error?.message || "Failed to update bundle status"
        )
      },
    })
  }

  if (!organizationID) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Organization information is unavailable.
      </div>
    )
  }

  if (bundleLoading && !bundle) {
    return (
      <div className="p-6">
        <Loader text="Loading bundle details" />
      </div>
    )
  }

  if (!bundle) {
    return (
      <div className="p-6">
        <State
          message="Bundle not found"
          description="The bundle may have been deleted or you may not have access to it."
          PortalButton={
            <Button variant="outline" render={<Link href="/bundles" />}>
              Back to bundles
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Top navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/bundles" />}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to bundles
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            render={<Link href={`/styles/${bundle.style_id}`} />}
          >
            <Shirt className="mr-2 size-4" />
            View style details
            <ExternalLink className="ml-2 size-3.5" />
          </Button>

          <Button
            render={
              <Link
                href={`/production-entries?bundle_id=${encodeURIComponent(
                  bundle.id
                )}`}
              />
            }
          >
            <Package className="mr-2 size-4" />
            View production entries
          </Button>
        </div>
      </div>

      {/* Bundle heading */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
            <Package className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">
              Bundle details
            </p>

            <h1 className="truncate font-mono text-2xl font-semibold tracking-tight">
              {bundle.bundle_number}
            </h1>
          </div>

          <StatusBadge status={bundle.status} />
        </div>

        <p className="text-sm text-muted-foreground">
          Review bundle information and track its progress through
          production.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Bundle information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Bundle information
              </CardTitle>

              <CardDescription>
                Core details captured when this bundle was created.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Bundle number
                </p>

                <p className="font-mono font-semibold">
                  {bundle.bundle_number}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Quantity
                </p>

                <p className="font-semibold tabular-nums">
                  {Number(bundle.quantity || 0).toLocaleString("en-IN")}{" "}
                  pieces
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Style
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">
                    {style?.name ||
                      (styleLoading ? "Loading style…" : "Style")}
                  </p>

                  {style?.style_number && (
                    <span className="text-xs text-muted-foreground">
                      ({style.style_number})
                    </span>
                  )}

                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    render={<Link href={`/styles/${bundle.style_id}`} />}
                  >
                    Open style
                    <ExternalLink className="ml-1 size-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Size
                </p>

                <div className="flex items-center gap-2">
                  <Ruler className="size-4 text-muted-foreground" />

                  <p className="font-medium">{sizeName}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Created
                </p>

                <p className="font-medium">
                  {formatDate(bundle.created_at)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Last updated
                </p>

                <p className="font-medium">
                  {formatDate(bundle.updated_at)}
                </p>
              </div>

              {bundle.remarks && (
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">
                    Remarks
                  </p>

                  <p className="whitespace-pre-wrap text-sm">
                    {bundle.remarks}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attributes */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-muted-foreground" />

                <CardTitle className="text-base">
                  Manufacturing attributes
                </CardTitle>
              </div>

              <CardDescription>
                Shade, colour, fabric lot, and other bundle-specific
                details.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {Object.keys(attributes).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No manufacturing attributes were added.
                </p>
              ) : (
                <div className="divide-y rounded-lg border">
                  {Object.entries(attributes).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-wrap items-start justify-between gap-3 px-4 py-3"
                    >
                      <span className="text-sm capitalize text-muted-foreground">
                        {humanize(key)}
                      </span>

                      <span className="max-w-[65%] break-words text-right text-sm font-medium">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value ?? "—")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Status timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Production status
              </CardTitle>

              <CardDescription>
                Track each stage of this bundle's production journey.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-0">
                {STATUS_STEPS.map((step, index) => {
                  const StepIcon = step.icon
                  const stepOrder = STATUS_ORDER[step.key]

                  const isStepComplete =
                    currentStatusIndex >= stepOrder

                  const isCurrentStep =
                    currentStatusIndex === stepOrder

                  const isFutureStep =
                    currentStatusIndex < stepOrder

                  return (
                    <div
                      key={step.key}
                      className="relative flex gap-3"
                    >
                      {/* Timeline connector */}
                      {index < STATUS_STEPS.length - 1 && (
                        <span
                          className={`absolute left-[15px] top-8 h-[calc(100%-0.5rem)] w-px ${
                            isStepComplete
                              ? "bg-primary"
                              : "bg-border"
                          }`}
                        />
                      )}

                      {/* Timeline icon */}
                      <div
                        className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border ${
                          isStepComplete
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {isStepComplete ? (
                          <Check className="size-4" />
                        ) : (
                          <StepIcon className="size-4" />
                        )}
                      </div>

                      {/* Timeline content */}
                      <div className="min-w-0 flex-1 pb-7">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p
                            className={`text-sm ${
                              isCurrentStep
                                ? "font-semibold"
                                : "font-medium"
                            }`}
                          >
                            {step.title}
                          </p>

                          {isCurrentStep && (
                            <Badge variant="secondary">
                              Current
                            </Badge>
                          )}

                          {isFutureStep && (
                            <span className="text-xs text-muted-foreground">
                              Pending
                            </span>
                          )}

                          {isStepComplete && !isCurrentStep && (
                            <span className="text-xs text-green-600">
                              Completed
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {step.description}
                        </p>

                        {step.key === "created" && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(bundle.created_at)}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <Separator />

              {/* Next status action */}
              {nextStatusStep ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock3 className="size-4 text-muted-foreground" />

                    <p className="text-sm font-medium">
                      Next step: {nextStatusStep.title}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleStatusUpdate}
                    disabled={isUpdatingStatus}
                  >
                    {nextStatusStep.key === "ready" && (
                      <CheckCircle2 className="mr-2 size-4" />
                    )}

                    {nextStatusStep.key === "in_progress" && (
                      <Play className="mr-2 size-4" />
                    )}

                    {nextStatusStep.key === "completed" && (
                      <PackageCheck className="mr-2 size-4" />
                    )}

                    {isUpdatingStatus
                      ? "Updating status…"
                      : nextStatusStep.actionLabel}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    The bundle will move to the next status. Status
                    changes cannot be reversed.
                  </p>
                </div>
              ) : isCompleted ? (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  <CheckCircle2 className="size-5 shrink-0" />

                  <div>
                    <p className="font-semibold">
                      Production completed
                    </p>

                    <p className="mt-0.5 text-xs">
                      This bundle has completed all production stages.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                  Unknown bundle status: {humanize(currentStatus)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Quick links
              </CardTitle>

              <CardDescription>
                Jump to related production records.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full justify-between"
                render={<Link href={`/styles/${bundle.style_id}`} />}
              >
                <span className="flex items-center">
                  <Shirt className="mr-2 size-4" />
                  View style details
                </span>

                <ExternalLink className="size-4" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between"
                render={
                  <Link
                    href={`/production-entries?bundle_id=${encodeURIComponent(
                      bundle.id
                    )}`}
                  />
                }
              >
                <span className="flex items-center">
                  <Sparkles className="mr-2 size-4" />
                  View entries for this bundle
                </span>

                <ExternalLink className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}