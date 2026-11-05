"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  BookAlertIcon,
  CalendarDays,
  Clock3,
  ExternalLink,
  IndianRupee,
  Package,
  Pencil,
  Scissors,
  Trash2,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import State from "@/components/StateComponent"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatDate, getInitials } from "@/utils/utils"

import type {
  ProductionEntry,
  UpdateProductionEntryPayload,
} from "@/utils/zodSchema/production-entry"

import ProductionEntryHeader from "./components/header"
import EditProductionEntryDialog from "./components/edit-dialog"
import DeleteProductionEntryDialog from "./components/delete-dialog"
import StateComponent from "@/components/StateComponent"

function unwrapEntry(result: any): ProductionEntry | null {
  const value =
    result?.production_entry ?? result?.entry ?? result?.data ?? result

  return value && typeof value === "object" && value.id ? value : null
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0) / 100)
}

function toDateTimeLocal(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16)
}

export default function ProductionEntryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const entryID = params.id as string

  const { user } = useUser()
  const organizationID = user?.organization_id

  const [entry, setEntry] = useState<ProductionEntry | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const entryURL =
    organizationID && entryID
      ? `/api/organizations/${organizationID}/production-entries/${entryID}`
      : ""

  const { refetch: fetchEntry, isLoading } = useFetch({
    auto: false,
    onSuccess: (result: any) => {
      const fetched = unwrapEntry(result)
      if (fetched) setEntry(fetched)
      else toast.error("Production entry was not found")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to load production entry")
    },
  })

  const { refetch: updateEntry, isLoading: isSaving } = useFetch({
    auto: false,
  })

  const { refetch: deleteEntry, isLoading: isDeleting } = useFetch({
    auto: false,
  })

  const loadEntry = useCallback(() => {
    if (!entryURL) return
    fetchEntry({ url: entryURL, method: "GET" })
  }, [entryURL, fetchEntry])

  useEffect(() => {
    loadEntry()
  }, [loadEntry])

  const handleUpdate = async (values: UpdateProductionEntryPayload) => {
    if (!entryURL) return

    await updateEntry({
      url: entryURL,
      method: "PUT",
      payload: values,
      onSuccess: (result: any) => {
        const updated = unwrapEntry(result)
        setEntry((current) =>
          current
            ? {
                ...current,
                ...(updated || {}),
                bundle_id: values.bundle_id,
                worker_id: values.worker_id,
                quantity: values.quantity,
                production_date: values.production_date,
                remarks: values.remarks || "",
              }
            : current
        )
        setEditOpen(false)
        toast.success("Production entry updated")
        loadEntry()
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to update production entry")
      },
    })
  }

  const handleDelete = async () => {
    if (!entryURL) return

    await deleteEntry({
      url: entryURL,
      method: "DELETE",
      onSuccess: () => {
        toast.success("Production entry deleted")
        router.push("/production-entries")
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete production entry")
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
          <Button
            variant="outline"
            render={<Link href="/production-entries" />}
          >
            Back to entries
          </Button>
        }
      />
    )
  }

  if (isLoading && !entry) {
    return <Loader text="Loading production entry" />
  }

  if (!entry) {
    return (
      <StateComponent
        className="rounded-none"
        message="Production entry not found"
        description="This entry may have been deleted or not accessible."
        ICON={<BookAlertIcon className="size-8 text-muted-foreground" />}
        PortalButton={
          <Button
            variant="outline"
            render={<Link href="/production-entries" />}
          >
            Back to entries
          </Button>
        }
      />
    )
  }

  const worker = entry.worker
  const bundle = entry.bundle
  const style = entry.style
  const operation = entry.operation

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <ProductionEntryHeader
        entry={entry}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Production summary</CardTitle>
              <CardDescription>
                Recorded output, production rate, and calculated amount.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Quantity completed
                </p>
                <p className="text-2xl font-semibold tabular-nums">
                  {Number(entry.quantity || 0).toLocaleString("en-IN")}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    pcs
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Rate per piece</p>
                <p className="text-xl font-semibold tabular-nums">
                  {formatMoney(entry.rate_per_piece)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total amount</p>
                <p className="text-xl font-semibold tabular-nums">
                  {formatMoney(entry.total_amount)}
                </p>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <p className="text-xs text-muted-foreground">Production date</p>
                <div className="flex items-center gap-2 font-medium">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  {formatDate(entry.production_date)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Worker</CardTitle>
              <CardDescription>
                The person who completed this operation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage
                    src={worker?.photo_url || undefined}
                    alt={worker?.name || "Worker"}
                  />
                  <AvatarFallback>
                    {getInitials(worker?.name || "Unknown worker")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {worker?.name || "Unknown worker"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {worker?.phone || "No phone number"}
                  </p>
                </div>
                {worker?.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/workers/${worker.id}`} />}
                  >
                    View worker <ExternalLink className="ml-2 size-3.5" />
                  </Button>
                )}
              </div>
              <Separator className="my-4" />
              <Button
                variant="link"
                className="h-auto p-0"
                render={
                  <Link
                    href={`/production-entries?worker_id=${encodeURIComponent(entry.worker_id)}`}
                  />
                }
              >
                View all entries for this worker{" "}
                <ExternalLink className="ml-1 size-3" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bundle and style</CardTitle>
              <CardDescription>
                Garment batch associated with this production record.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Bundle number</p>
                <p className="font-semibold">{bundle?.bundle_number || "—"}</p>
                <p className="text-xs text-muted-foreground">
                  Bundle quantity:{" "}
                  {Number(bundle?.quantity || 0).toLocaleString("en-IN")} pcs
                </p>
                {bundle?.status && (
                  <Badge variant="outline" className="mt-2">
                    {bundle.status.replaceAll("_", " ")}
                  </Badge>
                )}
                {bundle?.id && (
                  <div className="pt-2">
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      render={<Link href={`/bundles/${bundle.id}`} />}
                    >
                      View bundle <ExternalLink className="ml-1 size-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Style</p>
                <p className="font-semibold">{style?.name || "—"}</p>
                <p className="text-xs text-muted-foreground">
                  {style?.style_number || "No style number"}
                </p>
                {style?.id && (
                  <div className="pt-2">
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      render={<Link href={`/styles/${style.id}`} />}
                    >
                      View style <ExternalLink className="ml-1 size-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Operation details</CardTitle>
              <CardDescription>
                Work step and applicable piece rate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Scissors className="size-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">
                    {operation?.name || "Unknown operation"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Style operation
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Rate per piece</span>
                <span className="font-medium tabular-nums">
                  {formatMoney(
                    operation?.rate_per_piece ?? entry.rate_per_piece
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Recorded quantity</span>
                <span className="font-medium tabular-nums">
                  {entry.quantity}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Remarks and record info
              </CardTitle>
              <CardDescription>
                Notes and audit timestamps for this entry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Remarks</p>
                <p className="text-sm whitespace-pre-wrap">
                  {entry.remarks?.trim() || "No remarks added."}
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="size-4" /> Created
                </span>
                <span className="text-right">
                  {formatDate(entry.created_at)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="size-4" /> Last updated
                </span>
                <span className="text-right">
                  {formatDate(entry.updated_at)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick links</CardTitle>
              <CardDescription>
                Jump to related records and lists.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-between"
                render={<Link href="/production-entries" />}
              >
                <span className="flex items-center gap-2">
                  <Package className="size-4" /> All production entries
                </span>
                <ExternalLink className="size-4" />
              </Button>
              {worker?.id && (
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  render={<Link href={`/workers/${worker.id}`} />}
                >
                  <span className="flex items-center gap-2">
                    <UserRound className="size-4" /> Worker profile
                  </span>
                  <ExternalLink className="size-4" />
                </Button>
              )}
              {bundle?.id && (
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  render={<Link href={`/bundles/${bundle.id}`} />}
                >
                  <span className="flex items-center gap-2">
                    <Package className="size-4" /> Bundle details
                  </span>
                  <ExternalLink className="size-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <EditProductionEntryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        entry={entry}
        onSubmit={handleUpdate}
        isSaving={isSaving}
        toDateTimeLocal={toDateTimeLocal}
      />

      <DeleteProductionEntryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entry={entry}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  )
}
