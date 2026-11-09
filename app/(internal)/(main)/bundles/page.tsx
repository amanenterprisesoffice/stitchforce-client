"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PackagePlus, Search } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import { Button } from "@/components/ui/button"
import StateComponent from "@/components/StateComponent"

import type { Bundle, BundleFormValues } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { Size } from "@/utils/zodSchema/size"
import { unwrapList } from "@/utils/utils"

import BundlesHeader from "./components/header"
import BundlesTable from "./components/table"
import BundleFormDialog from "./components/form-dialog"
import DeleteBundleDialog from "./components/delete-bundle-dialog"
import BundleFilters from "./components/filters"
import Pagination from "../../../../components/ui/pagination"

const DEFAULT_LIMIT = 25
const MAX_OPTION_LIMIT = 1000

type FilterState = {
  search: string
  styleID: string
  sizeID: string
  status: string
  createdFrom: string
  createdTo: string
}

function readInitialFilters(params: URLSearchParams): FilterState {
  return {
    search: params.get("search") || "",
    styleID: params.get("style_id") || "",
    sizeID: params.get("size_id") || "",
    status: params.get("status") || "",
    createdFrom: params.get("created_from") || "",
    createdTo: params.get("created_to") || "",
  }
}

function buildQuery(filters: FilterState, limit: number, offset: number) {
  const params = new URLSearchParams()
  if (filters.search.trim()) params.set("search", filters.search.trim())
  if (filters.styleID) params.set("style_id", filters.styleID)
  if (filters.sizeID) params.set("size_id", filters.sizeID)
  if (filters.status) params.set("status", filters.status)
  if (filters.createdFrom) params.set("created_from", filters.createdFrom)
  if (filters.createdTo) params.set("created_to", filters.createdTo)
  params.set("limit", String(limit))
  params.set("offset", String(offset))
  return params.toString()
}

function readTotal(response: unknown): number | undefined {
  if (!response || typeof response !== "object") return undefined
  const value = response as Record<string, any>
  const candidates = [
    value.total,
    value.total_count,
    value.count,
    value.pagination?.total,
    value.meta?.total,
    value.meta?.total_count,
  ]
  const candidate = candidates.find(
    (item) =>
      item !== null &&
      item !== undefined &&
      item !== "" &&
      Number.isFinite(Number(item))
  )
  return candidate === undefined ? undefined : Number(candidate)
}

export default function BundlesPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id
  const searchParams = useSearchParams()
  const base = organizationID ? `/api/organizations/${organizationID}` : ""
  const bundlesURL = `${base}/bundles`

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    styleID: "",
    sizeID: "",
    status: "",
    createdFrom: "",
    createdTo: "",
  })
  const [filtersInitialized, setFiltersInitialized] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(0)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null)
  const [deletingBundle, setDeletingBundle] = useState<Bundle | null>(null)

  const {
    data: bundlesResponse,
    refetch: fetchBundles,
    isLoading: bundlesLoading,
  } = useFetch<unknown>({ auto: false })
  const {
    data: stylesResponse,
    refetch: fetchStyles,
    isLoading: stylesLoading,
  } = useFetch<unknown>({ auto: false })
  const {
    data: sizesResponse,
    refetch: fetchSizes,
    isLoading: sizesLoading,
  } = useFetch<unknown>({ auto: false })
  const { refetch: mutateBundle, isLoading: isSaving } = useFetch({
    auto: false,
  })

  const bundles = useMemo(
    () => unwrapList<Bundle>(bundlesResponse, ["bundles"]),
    [bundlesResponse]
  )
  const styles = useMemo(
    () => unwrapList<Style>(stylesResponse, ["styles"]),
    [stylesResponse]
  )
  const sizes = useMemo(
    () => unwrapList<Size>(sizesResponse, ["sizes"]),
    [sizesResponse]
  )

  // Hydrate filters and pagination from the incoming URL.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    setFilters(readInitialFilters(params))
    const initialLimit = Number(params.get("limit"))
    const initialOffset = Number(params.get("offset"))
    if (Number.isInteger(initialLimit) && initialLimit > 0)
      setLimit(initialLimit)
    if (Number.isInteger(initialOffset) && initialOffset >= 0)
      setOffset(initialOffset)
    setFiltersInitialized(true)
  }, [searchParams])

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(filters.search),
      350
    )
    return () => window.clearTimeout(timer)
  }, [filters.search])

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((current) => ({ ...current, [key]: value }))
      setOffset(0)
    },
    []
  )

  // Fetch dropdown options once; list data remains backend-filtered and paginated.
  useEffect(() => {
    if (!organizationID) return
    fetchStyles({
      url: `${base}/styles?limit=${MAX_OPTION_LIMIT}&offset=0`,
    })
    fetchSizes({
      url: `${base}/sizes?limit=${MAX_OPTION_LIMIT}&offset=0`,
    })
  }, [organizationID, base, fetchStyles, fetchSizes])

  const loadBundles = useCallback(() => {
    if (!bundlesURL || !filtersInitialized) return
    fetchBundles({
      url: `${bundlesURL}?${buildQuery(
        { ...filters, search: debouncedSearch },
        limit,
        offset
      )}`,
    })
  }, [
    bundlesURL,
    filtersInitialized,
    fetchBundles,
    filters.styleID,
    filters.sizeID,
    filters.status,
    filters.createdFrom,
    filters.createdTo,
    debouncedSearch,
    limit,
    offset,
  ])

  useEffect(() => {
    if (!filtersInitialized) return
    loadBundles()
  }, [loadBundles, filtersInitialized])

  const totalItems = readTotal(bundlesResponse)
  const hasNextPage =
    totalItems !== undefined
      ? offset + bundles.length < totalItems
      : bundles.length === limit

  const openCreateDialog = () => {
    setEditingBundle(null)
    setDialogOpen(true)
  }

  const openEditDialog = (bundle: Bundle) => {
    setEditingBundle(bundle)
    setDialogOpen(true)
  }

  const handleSave = async (values: BundleFormValues) => {
    if (!organizationID) {
      toast.error("Organization not found")
      return
    }

    const bundleNumber = values.bundle_number.trim()
    const duplicateBundle = bundles.some(
      (bundle) =>
        bundle.bundle_number.trim().toLowerCase() ===
          bundleNumber.toLowerCase() && bundle.id !== editingBundle?.id
    )
    if (duplicateBundle) {
      toast.error("This bundle number already exists")
      return
    }

    const isEditing = !!editingBundle
    const payload = {
      bundle_number: bundleNumber,
      style_id: values.style_id,
      size_id: values.size_id,
      quantity: values.quantity,
      attributes: values.attributes,
      remarks: values.remarks.trim(),
    }

    await mutateBundle({
      url: isEditing ? `${bundlesURL}/${editingBundle.id}` : bundlesURL,
      method: isEditing ? "PUT" : "POST",
      payload,
      onSuccess: () => {
        toast.success(
          isEditing
            ? "Bundle updated successfully"
            : "Bundle created successfully"
        )
        setDialogOpen(false)
        setEditingBundle(null)
        loadBundles()
      },
    })
  }

  const handleDelete = async () => {
    if (!deletingBundle || !organizationID) return
    await mutateBundle({
      url: `${bundlesURL}/${deletingBundle.id}`,
      method: "DELETE",
      onSuccess: () => {
        toast.success("Bundle deleted successfully")
        setDeleteDialogOpen(false)
        setDeletingBundle(null)
        loadBundles()
      },
    })
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      styleID: "",
      sizeID: "",
      status: "",
      createdFrom: "",
      createdTo: "",
    })
    setOffset(0)
    // clear all query params
    const url = new URL(window.location.href)
    url.search = ""
    window.history.replaceState({}, "", url)
  }

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Error"
        description="Something went wrong"
      />
    )
  }

  const isLoading =
    (bundlesLoading && !bundlesResponse) ||
    (stylesLoading && !stylesResponse) ||
    (sizesLoading && !sizesResponse)

  const isEmptyPage = !isLoading && bundles.length === 0 && offset > 0
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <BundlesHeader
        count={totalItems ?? bundles.length}
        onCreate={openCreateDialog}
      />

      <div className="flex h-full gap-4">
        <BundleFilters
          styles={styles}
          sizes={sizes}
          styleFilter={filters.styleID || "all"}
          sizeFilter={filters.sizeID || "all"}
          statusFilter={filters.status || "all"}
          createdFrom={filters.createdFrom}
          createdTo={filters.createdTo}
          search={filters.search}
          onSearchChange={(value) => updateFilter("search", value)}
          onStyleChange={(value) =>
            updateFilter("styleID", value === "all" ? "" : value)
          }
          onSizeChange={(value) =>
            updateFilter("sizeID", value === "all" ? "" : value)
          }
          onStatusChange={(value) =>
            updateFilter("status", value === "all" ? "" : value)
          }
          onCreatedFromChange={(value) => updateFilter("createdFrom", value)}
          onCreatedToChange={(value) => updateFilter("createdTo", value)}
          onClear={clearFilters}
        />

        <div className="relative flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          {isEmptyPage ? (
            <StateComponent
              message="No more bundles on this page"
              ICON={<PackagePlus />}
              description="There are no bundles available at this page. You can go back to the previous page to view available bundles."
              PortalButton={
                <Button variant="outline" onClick={() => setOffset(0)}>
                  Go to first page
                </Button>
              }
            />
          ) : !isLoading && bundles.length === 0 ? (
            <StateComponent
              message={
                filters.search ||
                filters.styleID ||
                filters.sizeID ||
                filters.status ||
                filters.createdFrom ||
                filters.createdTo
                  ? "No bundles found"
                  : "No bundles yet"
              }
              ICON={<PackagePlus />}
              description={
                filters.search ||
                filters.styleID ||
                filters.sizeID ||
                filters.status ||
                filters.createdFrom ||
                filters.createdTo
                  ? "Try changing your search or filters."
                  : "Create your first garment bundle by assigning an existing style, size, quantity, and manufacturing attributes."
              }
              PortalButton={
                <Button
                  variant="outline"
                  onClick={
                    filters.search ||
                    filters.styleID ||
                    filters.sizeID ||
                    filters.status ||
                    filters.createdFrom ||
                    filters.createdTo
                      ? clearFilters
                      : openCreateDialog
                  }
                >
                  {filters.search ||
                  filters.styleID ||
                  filters.sizeID ||
                  filters.status ||
                  filters.createdFrom ||
                  filters.createdTo
                    ? "Clear filters"
                    : "Create your first bundle"}
                </Button>
              }
            />
          ) : (
            <>
              <BundlesTable
                bundles={bundles}
                styles={styles}
                sizes={sizes}
                onEdit={openEditDialog}
                isLoading={bundlesLoading}
                onDelete={(bundle) => {
                  setDeletingBundle(bundle)
                  setDeleteDialogOpen(true)
                }}
              />
              <Pagination
                limit={limit}
                offset={offset}
                itemCount={bundles.length}
                totalItems={totalItems}
                hasNextPage={hasNextPage}
                onPageChange={setOffset}
                onLimitChange={(nextLimit) => {
                  setLimit(nextLimit)
                  setOffset(0)
                }}
              />
            </>
          )}
        </div>
      </div>

      <BundleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingBundle={editingBundle}
        styles={styles}
        sizes={sizes}
        onSubmit={handleSave}
        isSaving={isSaving}
      />

      <DeleteBundleDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        bundle={deletingBundle}
        onDelete={handleDelete}
        isDeleting={isSaving}
        onCancel={() => setDeletingBundle(null)}
      />
    </div>
  )
}
