"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Search, Scissors, Plus } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Loader from "@/components/ui/Loader"
import State from "@/components/StateComponent"

import type {
  ProductionEntry,
  ProductionWorker,
  ProductionBundle,
  ProductionStyle,
  StyleOperation,
} from "./schema"
import { unwrapList } from "./schema"
import ProductionEntriesHeader from "./components/header"
import ProductionEntriesTable from "./components/table"
import ProductionEntryFilters from "./components/filters"
import ProductionEntryDetailsDialog from "./components/details-dialog"
import EditProductionEntryDialog from "./components/form-dialog"
import DeleteProductionEntryDialog from "./components/delete-dialog"

export default function ProductionEntriesPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id
  const baseURL = organizationID
    ? `/api/organizations/${organizationID}/production-entries`
    : ""
  const [search, setSearch] = useState("")
  const [workerFilter, setWorkerFilter] = useState("all")
  const [bundleFilter, setBundleFilter] = useState("all")
  const [operationFilter, setOperationFilter] = useState("all")
  const [viewing, setViewing] = useState<ProductionEntry | null>(null)
  const [editing, setEditing] = useState<ProductionEntry | null>(null)
  const [deleting, setDeleting] = useState<ProductionEntry | null>(null)
  const [workers, setWorkers] = useState<ProductionWorker[]>([])
  const [bundles, setBundles] = useState<ProductionBundle[]>([])
  const [styles, setStyles] = useState<ProductionStyle[]>([])
  const [operationsByStyle, setOperationsByStyle] = useState<
    Record<string, StyleOperation[]>
  >({})
  const [entries, setEntries] = useState<ProductionEntry[]>([])

  const { refetch: fetchEntries, isLoading: entriesLoading } = useFetch({
    auto: false,
    onSuccess: (r: any) =>
      setEntries(
        unwrapList<ProductionEntry>(r, ["production_entries", "entries"])
      ),
  })
  const { refetch: fetchWorkers } = useFetch({
    auto: false,
    onSuccess: (r: any) =>
      setWorkers(
        unwrapList<ProductionWorker>(r, ["workers", "garment_workers"]).filter(
          (w) =>
            w.is_active !== false &&
            w.active !== false &&
            w.status !== "inactive"
        )
      ),
  })
  const { refetch: fetchBundles } = useFetch({
    auto: false,
    onSuccess: (r: any) =>
      setBundles(
        unwrapList<ProductionBundle>(r, ["bundles"]).filter(
          (b) => !b.deleted_at
        )
      ),
  })
  const { refetch: fetchStyles } = useFetch({
    auto: false,
    onSuccess: (r: any) =>
      setStyles(unwrapList<ProductionStyle>(r, ["styles"])),
  })
  const { refetch: fetchOperations } = useFetch({
    auto: false,
    onSuccess: (r: any) => {
      const list = unwrapList<StyleOperation>(r, ["operations"])
      setOperationsByStyle((prev) => ({
        ...prev,
        [String((r as any)?.__styleID || "")]: list,
      }))
    },
  })
  const { refetch: mutateEntry, isLoading: isSaving } = useFetch({
    auto: false,
  })

  const loadEntries = () =>
    fetchEntries({
      url: baseURL,
      method: "GET",
      onError: (e: any) =>
        toast.error(e?.message || "Failed to load production entries"),
    })
  useEffect(() => {
    if (!organizationID) return
    fetchEntries({
      url: baseURL,
      method: "GET",
      onError: (e: any) =>
        toast.error(e?.message || "Failed to load production entries"),
    })
    fetchWorkers({
      url: `/api/organizations/${organizationID}/garment-workers`,
      method: "GET",
      onError: (e: any) => toast.error(e?.message || "Failed to load workers"),
    })
    fetchBundles({
      url: `/api/organizations/${organizationID}/bundles`,
      method: "GET",
      onError: (e: any) => toast.error(e?.message || "Failed to load bundles"),
    })
    fetchStyles({
      url: `/api/organizations/${organizationID}/styles`,
      method: "GET",
      onError: (e: any) => toast.error(e?.message || "Failed to load styles"),
    })
  }, [organizationID])

  const workerMap = useMemo(
    () => new Map(workers.map((w) => [w.id, w])),
    [workers]
  )
  const bundleMap = useMemo(
    () => new Map(bundles.map((b) => [b.id, b])),
    [bundles]
  )
  const styleMap = useMemo(
    () => new Map(styles.map((s) => [s.id, s])),
    [styles]
  )
  const operationMap = useMemo(() => {
    const map = new Map<string, StyleOperation>()
    Object.values(operationsByStyle)
      .flat()
      .forEach((op) => map.set(op.id, op))
    return map
  }, [operationsByStyle])

  useEffect(() => {
    if (!organizationID || !styles.length) return
    styles.forEach((style) => {
      if (operationsByStyle[style.id]) return
      fetchOperations({
        url: `/api/organizations/${organizationID}/styles/${style.id}/operations`,
        method: "GET",
        onSuccess: (r: any) =>
          setOperationsByStyle((prev) => ({
            ...prev,
            [style.id]: unwrapList<StyleOperation>(r, ["operations"]),
          })),
        onError: () => undefined,
      })
    })
  }, [organizationID, styles])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((entry) => {
      const worker = workerMap.get(entry.worker_id)
      const bundle = bundleMap.get(entry.bundle_id)
      const operation = operationMap.get(entry.style_operation_id)
      const matchesSearch =
        !q ||
        [
          worker?.name,
          worker?.worker_name,
          bundle?.bundle_number,
          operation?.name,
          entry.remarks,
        ].some((v) =>
          String(v || "")
            .toLowerCase()
            .includes(q)
        )
      return (
        matchesSearch &&
        (workerFilter === "all" || entry.worker_id === workerFilter) &&
        (bundleFilter === "all" || entry.bundle_id === bundleFilter) &&
        (operationFilter === "all" ||
          entry.style_operation_id === operationFilter)
      )
    })
  }, [
    entries,
    search,
    workerFilter,
    bundleFilter,
    operationFilter,
    workerMap,
    bundleMap,
    operationMap,
  ])

  const saveEdit = async (values: {
    worker_id: string
    quantity: number
    production_date: string
    remarks: string
  }) => {
    if (!editing || !baseURL) return
    await mutateEntry({
      url: `${baseURL}/${editing.id}`,
      method: "PUT",
      payload: {
        bundle_id: editing.bundle_id,
        worker_id: values.worker_id,
        quantity: values.quantity,
        production_date: new Date(values.production_date).toISOString(),
        remarks: values.remarks,
      },
      onSuccess: () => {
        toast.success("Production entry updated")
        setEditing(null)
        loadEntries()
      },
      onError: (e: any) => toast.error(e?.message || "Failed to update entry"),
    })
  }

  const deleteEntry = async () => {
    if (!deleting || !baseURL) return
    await mutateEntry({
      url: `${baseURL}/${deleting.id}`,
      method: "DELETE",
      onSuccess: () => {
        toast.success("Production entry deleted")
        setDeleting(null)
        loadEntries()
      },
      onError: (e: any) => toast.error(e?.message || "Failed to delete entry"),
    })
  }

  if (!organizationID)
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Organization information is unavailable.
      </div>
    )

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <ProductionEntriesHeader count={entries.length} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search worker, bundle, operation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button render={<Link href="/production-entries/new" />}>
          <Plus className="size-4" /> Add production entries
        </Button>
      </div>
      <ProductionEntryFilters
        workers={workers}
        bundles={bundles}
        entries={entries}
        operations={Array.from(operationMap.values())}
        workerFilter={workerFilter}
        bundleFilter={bundleFilter}
        operationFilter={operationFilter}
        onWorkerChange={setWorkerFilter}
        onBundleChange={setBundleFilter}
        onOperationChange={setOperationFilter}
        onClear={() => {
          setWorkerFilter("all")
          setBundleFilter("all")
          setOperationFilter("all")
          setSearch("")
        }}
      />
      <div className="min-h-0 flex-1">
        {entriesLoading && !entries.length ? (
          <Loader text="Loading production entries" />
        ) : !entries.length ? (
          <State
            message="No production entries yet"
            ICON={<Scissors />}
            description="Start recording completed work against a bundle, operation, and worker."
            PortalButton={
              <Button render={<Link href="/production-entries/new" />}>Create first entry</Button>
            }
          />
        ) : !filtered.length ? (
          <State
            message="No entries found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <ProductionEntriesTable
            entries={filtered}
            workers={workerMap}
            bundles={bundleMap}
            styles={styleMap}
            operations={operationMap}
            onView={setViewing}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        )}
      </div>
      <ProductionEntryDetailsDialog
        entry={viewing}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        worker={viewing ? workerMap.get(viewing.worker_id) : undefined}
        bundle={viewing ? bundleMap.get(viewing.bundle_id) : undefined}
        operation={
          viewing ? operationMap.get(viewing.style_operation_id) : undefined
        }
      />
      <EditProductionEntryDialog
        entry={editing}
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        workers={workers}
        onSubmit={saveEdit}
        isSaving={isSaving}
      />
      <DeleteProductionEntryDialog
        entry={deleting}
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        onDelete={deleteEntry}
        isDeleting={isSaving}
      />
    </div>
  )
}
