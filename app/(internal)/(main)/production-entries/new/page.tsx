"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Package, Scissors, Users } from "lucide-react"
import { toast } from "sonner"
import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import FormSelect from "@/components/ui/FormSelect"
import Loader from "@/components/ui/Loader"
import State from "@/components/StateComponent"

import { getWorkerName } from "@/utils/zodSchema/garmentWorker"
import RecentEntriesTable from "../components/recent-entries-table"
import FormField from "@/components/ui/FormField"

import type {
  ProductionEntry,
  ProductionEntryPayload,
} from "@/utils/zodSchema/production-entry"
import { formatMoney, unwrapList } from "@/lib/utils"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import type { Bundle } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { StyleOperation } from "@/utils/zodSchema/styleops"

export default function NewProductionEntriesPage() {
  const { user } = useUser()
  const orgID = user?.organization_id
  const [workers, setWorkers] = useState<GarmentWorker[]>([])
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [styles, setStyles] = useState<Style[]>([])
  const [entries, setEntries] = useState<ProductionEntry[]>([])
  const [operations, setOperations] = useState<StyleOperation[]>([])
  const [bundleID, setBundleID] = useState("")
  const [operationID, setOperationID] = useState("")
  const [workerID, setWorkerID] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16))
  const [remarks, setRemarks] = useState("")
  const [opsLoading, setOpsLoading] = useState(false)
  const base = orgID ? `/api/organizations/${orgID}` : ""
  const selectedBundle = bundles.find((b) => b.id === bundleID)
  const selectedStyle = styles.find((s) => s.id === selectedBundle?.style_id)
  const { refetch: fetchWorkers } = useFetch({
    auto: false,
    onSuccess: (r: any) =>
      setWorkers(
        unwrapList<GarmentWorker>(r, ["workers", "garment_workers"]).filter(
          (w) => w.status !== "inactive"
        )
      ),
  })
  const { refetch: fetchBundles } = useFetch({
    auto: false,
    onSuccess: (r: any) =>
      setBundles(
        unwrapList<Bundle>(r, ["bundles"]).filter((b) => !b.deleted_at)
      ),
  })
  const { refetch: fetchStyles } = useFetch({
    auto: false,
    onSuccess: (r: any) => setStyles(unwrapList<Style>(r, ["styles"])),
  })
  const { refetch: fetchEntries, isLoading: entriesLoading } = useFetch({
    auto: false,
    onSuccess: (r: any) =>
      setEntries(
        unwrapList<ProductionEntry>(r, ["production_entries", "entries"])
      ),
  })
  const { refetch: fetchOperations } = useFetch({ auto: false })
  const { refetch: createEntry, isLoading: saving } = useFetch({ auto: false })

  const loadEntries = () => {
    if (!base) return
    fetchEntries({
      url: `${base}/production-entries`,
      method: "GET",
      onError: (e: any) => toast.error(e?.message || "Could not load entries"),
    })
  }
  useEffect(() => {
    if (!base) return
    fetchWorkers({
      url: `${base}/garment-workers`,
      method: "GET",
      onError: (e: any) => toast.error(e?.message || "Could not load workers"),
    })
    fetchBundles({
      url: `${base}/bundles`,
      method: "GET",
      onError: (e: any) => toast.error(e?.message || "Could not load bundles"),
    })
    fetchStyles({
      url: `${base}/styles`,
      method: "GET",
      onError: (e: any) => toast.error(e?.message || "Could not load styles"),
    })
    loadEntries()
  }, [orgID])
  useEffect(() => {
    setOperationID("")
    setOperations([])
    if (!selectedBundle?.style_id || !base) return
    setOpsLoading(true)
    fetchOperations({
      url: `${base}/styles/${selectedBundle.style_id}/operations`,
      method: "GET",
      onSuccess: (r: any) =>
        setOperations(unwrapList<StyleOperation>(r, ["operations"])),
      onError: (e: any) =>
        toast.error(e?.message || "Could not load style operations"),
    })
    setOpsLoading(false)
  }, [bundleID, orgID])
  const bundleProduced = useMemo(
    () =>
      entries
        .filter((e) => e.bundle_id === bundleID)
        .reduce((n, e) => n + Number(e.quantity || 0), 0),
    [entries, bundleID]
  )
  const remaining = Math.max(
    0,
    Number(selectedBundle?.quantity || 0) - bundleProduced
  )
  const selectedOperation = operations.find((o) => o.id === operationID)
  const q = Number(quantity)
  const validQuantity = Number.isInteger(q) && q > 0 && q <= remaining
  const projected = selectedOperation ? selectedOperation.rate_per_piece * q : 0
  const currentEntries = entries.filter(
    (e) => e.bundle_id === bundleID && e.style_operation_id === operationID
  )
  const workerMap = new Map(workers.map((w) => [w.id, w]))
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !base ||
      !selectedBundle ||
      !selectedOperation ||
      !workerID ||
      !validQuantity
    ) {
      toast.error(
        "Check the selected bundle, operation, worker, and available quantity"
      )
      return
    }
    const payload: ProductionEntryPayload = {
      bundle_id: bundleID,
      worker_id: workerID,
      style_operation_id: operationID,
      quantity: q,
      production_date: new Date(date).toISOString(),
      remarks: remarks.trim(),
    }
    await createEntry({
      url: `${base}/production-entries`,
      method: "POST",
      payload,
      onSuccess: () => {
        toast.success("Production entry added")
        setWorkerID("")
        setQuantity("1")
        setRemarks("")
        loadEntries()
      },
      onError: (err: any) =>
        toast.error(err?.message || "Failed to create production entry"),
    })
  }
  if (!orgID)
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Organization information is unavailable.
      </div>
    )
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Add production entries
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a bundle and operation once, then record output for each
            worker in sequence.
          </p>
        </div>
        <Badge variant="secondary">Multi-worker entry workflow</Badge>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Scissors className="size-4" />
              Production context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FormSelect
                  label="Bundle"
                  id="bundle"
                  value={bundleID}
                  onValueChange={setBundleID}
                  placeholder="Select a bundle"
                  options={bundles.map((b) => ({
                    value: b.id,
                    label: `${b.bundle_number} · ${b.quantity} pcs`,
                  }))}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  id="style"
                  label="Style"
                  readOnly
                  value={
                    selectedStyle
                      ? (selectedStyle.style_number
                          ? `${selectedStyle.style_number} · `
                          : "") + selectedStyle.name
                      : "Automatically set from bundle"
                  }
                />
              </div>
              <div className="space-y-2">
                <FormSelect
                  id="operation"
                  label="Operation"
                  value={operationID}
                  onValueChange={setOperationID}
                  placeholder={
                    opsLoading ? "Loading operations..." : "Select operation"
                  }
                  disabled={!bundleID || opsLoading}
                  options={operations.map((o) => ({
                    value: o.id,
                    label: o.name,
                  }))}
                />
                {opsLoading && (
                  <p className="text-xs text-muted-foreground">
                    Loading operations for selected style…
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <FormField
                  id="production_date"
                  label="Production date"
                  type="datetime-local"
                  value={date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDate(e.target.value)
                  }
                  required
                />
              </div>
            </div>
            {selectedBundle && (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    Bundle quantity
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">
                    {selectedBundle.quantity.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    Already produced
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">
                    {bundleProduced.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    Remaining quantity
                  </p>
                  <p
                    className={`mt-1 text-xl font-semibold tabular-nums ${remaining === 0 ? "text-destructive" : ""}`}
                  >
                    {remaining.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="h-fit shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4" />
              Worker production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <FormSelect
                  id="worker"
                  label="Worker"
                  value={workerID}
                  onValueChange={setWorkerID}
                  placeholder="Select active worker"
                  options={workers.map((w) => ({
                    value: w.id,
                    label: getWorkerName(w),
                  }))}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  id="quantity"
                  label="Quantity completed"
                  type="number"
                  min="1"
                  max={remaining}
                  step="1"
                  value={quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setQuantity(e.target.value)
                  }
                  disabled={!bundleID || remaining === 0}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Maximum allowed for this bundle: {remaining}
                </p>
                {quantity && Number(quantity) > remaining && (
                  <p className="text-xs text-destructive">
                    Quantity cannot exceed remaining bundle quantity.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <FormField
                  id="remarks"
                  label="Remarks (optional)"
                  rows={3}
                  maxLength={1000}
                  value={remarks}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setRemarks(e.target.value)
                  }
                  placeholder="Work completed, notes…"
                  isTextArea
                />
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rate per piece</span>
                  <strong>
                    {selectedOperation
                      ? formatMoney(selectedOperation.rate_per_piece)
                      : "—"}
                  </strong>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estimated earnings
                  </span>
                  <strong className="text-xl tabular-nums">
                    {selectedOperation && validQuantity
                      ? formatMoney(projected)
                      : "—"}
                  </strong>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Rate is read-only. The backend calculates and stores the
                  authoritative rate and total.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  saving ||
                  !bundleID ||
                  !operationID ||
                  !workerID ||
                  !date ||
                  !validQuantity ||
                  opsLoading
                }
              >
                <CheckCircle2 className="mr-2 size-4" />
                {saving ? "Saving entry…" : "Add worker entry"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                After saving, the bundle and operation stay selected so you can
                add another worker.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
      {bundleID && operationID ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">
              Entries for this bundle & operation
            </h2>
            <p className="text-sm text-muted-foreground">
              Existing records remain visible while you add workers to this
              production batch.
            </p>
          </div>
          {entriesLoading && !entries.length ? (
            <Loader />
          ) : currentEntries.length ? (
            <RecentEntriesTable entries={currentEntries} workers={workerMap} />
          ) : (
            <State
              message="No entries for this selection yet"
              description="The first saved worker entry will appear here."
            />
          )}
        </section>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          <Package className="mx-auto mb-2 size-5" />
          Select a bundle and operation to see its existing entries.
        </div>
      )}
    </div>
  )
}
