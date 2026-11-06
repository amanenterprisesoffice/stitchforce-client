"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Clock3,
  ExternalLink,
  Package,
  PackageCheck,
  Palette,
  Play,
  Ruler,
  Shirt,
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import StateComponent from "@/components/StateComponent"
import { Bundle, BundleStatus, STATUS_LABELS } from "@/utils/zodSchema/bundle"
import { prettifyKey } from "@/utils/utils"
import BundleDetailsHeader from "./components/header"
import { Style } from "@/utils/zodSchema/style"
import { Size } from "@/utils/zodSchema/size"
import QRCode from "@/components/ui/qr-code"

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
    description: "Bundle created and recorded.",
    actionLabel: "",
    icon: Package,
  },
  {
    key: "ready",
    title: "Ready",
    description: "Prepared and ready for production.",
    actionLabel: "Mark as Ready",
    icon: CheckCircle2,
  },
  {
    key: "in_progress",
    title: "In Progress",
    description: "Production work has started.",
    actionLabel: "Start Production",
    icon: Play,
  },
  {
    key: "completed",
    title: "Completed",
    description: "Production for this bundle is complete.",
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

function isValidStatus(status: string): status is BundleStatus {
  return Object.prototype.hasOwnProperty.call(STATUS_ORDER, status)
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
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

  const { refetch: fetchBundle, isLoading: bundleLoading } = useFetch({
    auto: false,
    onSuccess: (result: any) => {
      setBundle(result?.bundle ?? result?.data ?? result)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to load bundle")
    },
  })

  const { refetch: fetchStyle, isLoading: styleLoading } = useFetch({
    auto: false,
    onSuccess: (result: any) => {
      setStyle(result?.style ?? result?.data ?? result)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to load style details")
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
    onError: (error: any) => {
      toast.error(error?.message || "Failed to load sizes")
    },
  })

  const { refetch: updateStatus, isLoading: isUpdatingStatus } = useFetch({
    auto: false,
  })

  useEffect(() => {
    if (!organizationID || !bundleID) return

    fetchBundle({ url: bundleURL, method: "GET" })
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
  const currentStatusIndex = isValidStatus(currentStatus)
    ? STATUS_ORDER[currentStatus]
    : 0

  const nextStatusStep = STATUS_STEPS.find(
    (step) => STATUS_ORDER[step.key] === currentStatusIndex + 1
  )

  const handleStatusUpdate = async () => {
    if (!bundleURL || !bundle || !nextStatusStep) return

    const targetStatus = nextStatusStep.key

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
      onError: (error: any) => {
        toast.error(error?.message || "Failed to update bundle status")
      },
    })
  }

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Error"
        description="Something went wrong "
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

  const completed = currentStatus === "completed"

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 md:p-6">
      <BundleDetailsHeader
        bundle={bundle}
        style={style}
        styleLoading={styleLoading}
      />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-5">
          {/* At-a-glance details */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-none">
              <CardContent className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Quantity
                  </p>

                  <p className="text-3xl font-semibold tracking-tight tabular-nums">
                    {Number(bundle.quantity || 0).toLocaleString("en-IN")}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Pieces in this bundle
                  </p>
                </div>

                {/* <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="size-5 text-primary" />
                </div> */}
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Size
                  </p>

                  <p className="text-3xl font-semibold tracking-tight">
                    {sizeName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Bundle garment size
                  </p>
                </div>

                {/* <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                  <Ruler className="size-5 text-primary" />
                </div> */}
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Created
                  </p>

                  <p className="text-lg font-semibold tracking-tight">
                    {formatDate(bundle.created_at)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Bundle creation date
                  </p>
                </div>

                {/* <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarDays className="size-5 text-primary" />
                </div> */}
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Last updated
                  </p>

                  <p className="text-lg font-semibold tracking-tight">
                    {formatDate(bundle.updated_at)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Most recent modification
                  </p>
                </div>

                {/* <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                  <Clock className="size-5 text-primary" />
                </div> */}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Bundle information</CardTitle>
              <CardDescription>
                Style, size and manufacturing details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-x-8 gap-y-5 border-t pt-5 sm:grid-cols-2">
              <DetailItem
                label="Style"
                value={
                  <span className="flex flex-wrap items-center gap-2">
                    {style?.name || (styleLoading ? "Loading…" : "—")}
                    {style?.style_number && (
                      <span className="text-xs font-normal text-muted-foreground">
                        {style.style_number}
                      </span>
                    )}
                    <Link
                      className="text-xs font-medium text-primary hover:underline"
                      href={`/styles/${bundle.style_id}`}
                    >
                      Open style
                    </Link>
                  </span>
                }
              />
              <DetailItem label="Size" value={sizeName} />
              <DetailItem
                label="Bundle ID"
                value={
                  <span className="font-mono text-xs break-all">
                    {bundle.id}
                  </span>
                }
              />
              <DetailItem
                label="Quantity"
                value={`${Number(bundle.quantity || 0).toLocaleString("en-IN")} pieces`}
              />
              {bundle.remarks ? (
                <div className="sm:col-span-2">
                  <DetailItem
                    label="Remarks"
                    value={
                      <span className="font-normal whitespace-pre-wrap">
                        {bundle.remarks}
                      </span>
                    }
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Status progression */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Production progress</CardTitle>
              <CardDescription>
                Status moves forward one stage at a time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-4">
                {STATUS_STEPS.map((step, index) => {
                  const StepIcon = step.icon
                  const order = STATUS_ORDER[step.key]
                  const isDone = currentStatusIndex >= order
                  const isCurrent = currentStatusIndex === order

                  return (
                    <div
                      key={step.key}
                      className={`rounded-lg border p-3 ${isCurrent ? "border-primary/50 bg-primary/5" : ""}`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div
                          className={`flex size-8 items-center justify-center rounded-full ${isDone ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        >
                          {isDone ? (
                            <Check className="size-4" />
                          ) : (
                            <StepIcon className="size-4" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                      {isCurrent && (
                        <Badge variant="secondary" className="mt-2">
                          Current stage
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>

              <Separator />

              {nextStatusStep ? (
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-2">
                    <Clock3 className="mt-0.5 size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Next: {nextStatusStep.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        This updates the bundle to the next stage.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isUpdatingStatus}
                    size="sm"
                  >
                    {isUpdatingStatus
                      ? "Updating…"
                      : nextStatusStep.actionLabel}
                  </Button>
                </div>
              ) : completed ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="size-4" />
                  All production stages are complete.
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Unrecognized bundle status: {prettifyKey(currentStatus)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="size-4 text-muted-foreground" />
                Manufacturing attributes
              </CardTitle>
              <CardDescription>
                Additional information attached to this bundle.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              {Object.keys(attributes).length === 0 ? (
                <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                  No manufacturing attributes added.
                </p>
              ) : (
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Attribute</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {Object.entries(attributes).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">
                            {prettifyKey(key)}
                          </TableCell>

                          <TableCell className="text-right break-words text-muted-foreground">
                            {typeof value === "object" && value !== null
                              ? JSON.stringify(value)
                              : String(value ?? "—")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* QR and related actions */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-6">
          <QRCode
            value={`/production-entries/new?style_id=${bundle.style_id}&bundle_id=${bundle.id}`}
            title="Production QR code"
            description="Scan to create a production entry with this bundle selected."
            fileName={`${bundle.bundle_number}-production-qr`}
          />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Related pages</CardTitle>
              <CardDescription>
                Open records connected to this bundle.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-between"
                render={<Link href={`/styles/${bundle.style_id}`} />}
              >
                <span className="flex items-center gap-2">
                  <Shirt className="size-4" />
                  Style details
                </span>
                <ExternalLink className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                render={
                  <Link
                    href={`/production-entries?bundle_id=${encodeURIComponent(bundle.id)}`}
                  />
                }
              >
                <span className="flex items-center gap-2">
                  <Package className="size-4" />
                  Production entries
                </span>
                <ExternalLink className="size-4" />
              </Button>
              <Button
                className="w-full"
                render={
                  <Link
                    href={`/production-entries/new?style_id=${bundle.style_id}&bundle_id=${encodeURIComponent(bundle.id)}`}
                  />
                }
              >
                Create production entry
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
