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
  PackageCheck,
  Scissors,
} from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { formatDate, formatMoney, getInitials } from "@/utils/utils"

import type {
  ProductionEntry,
  UpdateProductionEntryPayload,
} from "@/utils/zodSchema/production-entry"

import ProductionEntryHeader from "./components/header"
import EditProductionEntryDialog from "./components/edit-dialog"
import DeleteProductionEntryDialog from "./components/delete-dialog"
import ProdEntryQuickLinks from "./components/quick-links"
import ProdEntrySummary from "./components/summary"

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-medium break-all">
        {value || "—"}
      </span>
    </div>
  )
}

export default function ProductionEntryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const entryID = params.id as string

  const { user } = useUser()
  const organizationID = user?.organization_id

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const entryURL =
    organizationID && entryID
      ? `/api/organizations/${organizationID}/production-entries/${entryID}`
      : ""

  const {
    data: entry,
    refetch: fetchEntry,
    isLoading,
  } = useFetch<ProductionEntry>({
    auto: true,
    url: entryURL,
  })

  const { refetch: updateEntry, isLoading: isSaving } = useFetch({
    auto: false,
  })

  const { refetch: deleteEntry, isLoading: isDeleting } = useFetch({
    auto: false,
  })

  const handleUpdate = async (values: UpdateProductionEntryPayload) => {
    if (!entryURL) return

    await updateEntry({
      url: entryURL,
      method: "PUT",
      payload: values,
      onSuccess: (result: any) => {
        toast.success("Production entry updated")
        fetchEntry({ url: entryURL })
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
        description="Something went wrong"
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
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-5 p-4 md:p-6">
      <ProductionEntryHeader
        entry={entry}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />
      <ProdEntrySummary entry={entry} />

      {/* Details */}
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        {/* Bundle, Style and Operation */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Production details</CardTitle>
            <CardDescription>
              Bundle, garment style and operation associated with this entry.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Bundle */}
            <Link
              href={`/bundles/${bundle?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/60"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Package className="size-5 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Bundle</p>
                <p className="font-semibold">{bundle?.bundle_number || "—"}</p>
                <p className="text-sm text-muted-foreground">
                  {Number(bundle?.quantity || 0).toLocaleString("en-IN")} pcs
                </p>
              </div>

              {bundle?.status && (
                <Badge variant="outline">
                  {bundle.status.replaceAll("_", " ")}
                </Badge>
              )}
              <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
            </Link>

            {/* Style */}
            <Link
              href={`/styles/${style?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/60"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <PackageCheck className="size-5 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Style</p>
                <p className="font-semibold">{style?.name || "—"}</p>
                <p className="text-sm text-muted-foreground">
                  {style?.style_number || "No style number"}
                </p>
              </div>

              <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
            </Link>

            {/* Operation - plain row */}
            <div className="flex min-w-0 items-center gap-3 px-3 py-1">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Scissors className="size-5 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Operation</p>
                <p className="font-semibold">
                  {operation?.name || "Unknown operation"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Rate:{" "}
                  {formatMoney(
                    operation?.rate_per_piece ?? entry.rate_per_piece
                  )}{" "}
                  per piece
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remarks and record info */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Remarks and record info</CardTitle>
            <CardDescription>
              Production date, notes and audit timestamps.
            </CardDescription>
          </CardHeader>

          <CardContent className="h-full space-y-4">
            <DetailRow label="Production entry ID" value={entry.id} />

            <DetailRow
              label="Production date"
              value={formatDate(entry.production_date)}
            />

            <DetailRow label="Created" value={formatDate(entry.created_at)} />

            <DetailRow
              label="Last updated"
              value={formatDate(entry.updated_at)}
            />
          </CardContent>
          <CardFooter>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Remarks</p>
              <p className="text-sm whitespace-pre-wrap">
                {entry.remarks?.trim() || "--"}
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* Quick links */}
      <ProdEntryQuickLinks
        bundle={bundle}
        style={style}
        worker={worker}
        entry={entry}
        router={router}
      />

      <EditProductionEntryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        entry={entry}
        onSubmit={handleUpdate}
        isSaving={isSaving}
      />

      <DeleteProductionEntryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entry={entry}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onCancel={() => setDeleteOpen(false)}
      />
    </main>
  )
}
