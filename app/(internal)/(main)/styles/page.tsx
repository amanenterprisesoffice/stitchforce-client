"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Plus, Shirt } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import { Button } from "@/components/ui/button"
import StateComponent from "@/components/StateComponent"
import Pagination from "@/components/ui/pagination"
import DebouncedSearch from "@/components/ui/debounced-search"

import type { Style } from "@/utils/zodSchema/style"

import StylesHeader from "./components/header"
import StylesTable from "./components/table"
import StyleFormDialog from "./components/form-dialog"
import DeleteStyleDialog from "./components/delete-style-dialog"

const DEFAULT_LIMIT = 10

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

  const total = candidates.find(
    (candidate) =>
      candidate !== null &&
      candidate !== undefined &&
      candidate !== "" &&
      Number.isFinite(Number(candidate))
  )

  return total === undefined ? undefined : Number(total)
}

function unwrapStyles(response: any): Style[] {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.styles)) return response.styles
  return []
}

function buildQuery(search: string, limit: number, offset: number) {
  const params = new URLSearchParams()

  if (search.trim()) {
    params.set("search", search.trim())
  }

  params.set("limit", String(limit))
  params.set("offset", String(offset))

  return params.toString()
}

export default function StylesPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const searchParams = useSearchParams()

  const stylesURL = organizationID
    ? `/api/organizations/${organizationID}/styles`
    : ""

  const [search, setSearch] = useState("")

  const [filtersInitialized, setFiltersInitialized] = useState(false)

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(0)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [editingStyle, setEditingStyle] = useState<Style | null>(null)
  const [deletingStyle, setDeletingStyle] = useState<Style | null>(null)

  // Initialize pagination and search from URL.
  useEffect(() => {
    setSearch(searchParams.get("search") || "")

    const initialLimit = Number(searchParams.get("limit"))
    const initialOffset = Number(searchParams.get("offset"))

    if (Number.isInteger(initialLimit) && initialLimit > 0) {
      setLimit(initialLimit)
    }

    if (Number.isInteger(initialOffset) && initialOffset >= 0) {
      setOffset(initialOffset)
    }

    setFiltersInitialized(true)
  }, [searchParams])

  // Build request URL.
  const requestURL = useMemo(() => {
    if (!stylesURL) return ""

    return `${stylesURL}?${buildQuery(search, limit, offset)}`
  }, [stylesURL, search, limit, offset])

  // Fetch styles.
  const {
    data: stylesData,
    isLoading,
    refetch: fetchStyles,
  } = useFetch<unknown>({ auto: true, url: requestURL })

  // Create, update and delete.
  const { isLoading: isSaving, refetch: mutateStyle } = useFetch({
    auto: false,
  })

  // Extract styles.
  const styles = useMemo(() => unwrapStyles(stylesData), [stylesData])

  // Extract total count.
  const totalItems = useMemo(() => readTotal(stylesData), [stylesData])

  useEffect(() => {
    if (!organizationID || !filtersInitialized) return
    fetchStyles()
  }, [requestURL, organizationID, filtersInitialized, fetchStyles])

  // Pagination.
  const hasNextPage =
    totalItems !== undefined
      ? offset + styles.length < totalItems
      : styles.length === limit

  const isEmptyPage = styles.length === 0 && offset > 0

  // Create.
  const openCreateDialog = () => {
    setEditingStyle(null)
    setDialogOpen(true)
  }

  // Edit.
  const openEditDialog = (style: Style) => {
    setEditingStyle(style)
    setDialogOpen(true)
  }

  // Search change.
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setOffset(0)
  }, [])

  // Save.
  const handleSave = async (values: any) => {
    if (!organizationID) {
      toast.error("Organization not found")
      return
    }

    const isEditing = !!editingStyle

    await mutateStyle({
      url: isEditing ? `${stylesURL}/${editingStyle.id}` : stylesURL,

      method: isEditing ? "PUT" : "POST",

      payload: {
        name: values.name.trim(),
        style_number: values.style_number.trim(),
        description: values.description?.trim() || "",
      },

      onSuccess: () => {
        toast.success(
          isEditing
            ? "Style updated successfully"
            : "Style created successfully"
        )

        setDialogOpen(false)
        setEditingStyle(null)

        fetchStyles()
      },

      onError: (error: any) => {
        toast.error(error?.message || "Failed to save style")
      },
    })
  }

  // Delete.
  const handleDelete = async () => {
    if (!deletingStyle || !organizationID) return

    await mutateStyle({
      url: `${stylesURL}/${deletingStyle.id}`,
      method: "DELETE",

      onSuccess: () => {
        toast.success("Style deleted successfully")

        setDeleteDialogOpen(false)
        setDeletingStyle(null)

        // If deleting the last item on a page, go to previous page.
        if (styles.length === 1 && offset > 0) {
          setOffset(Math.max(0, offset - limit))
        } else {
          fetchStyles()
        }
      },

      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete style")
      },
    })
  }

  // Clear search.
  const clearSearch = () => {
    setSearch("")
    setOffset(0)
  }

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Organization unavailable"
        description="Your organization information could not be loaded."
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <StylesHeader
        count={totalItems ?? styles.length}
        onCreate={openCreateDialog}
      />

      <DebouncedSearch
        value={search}
        onChange={handleSearchChange}
        placeholder="Search styles..."
        label="Find Styles"
      />

      <div className="relative flex flex-1 flex-col gap-4">
        {isLoading && !stylesData ? (
          <Loader text="Loading styles" />
        ) : isEmptyPage ? (
          <StateComponent
            message="No more styles on this page"
            ICON={<Shirt />}
            description="There are no styles available at this page. You can go back to the previous page to view available styles."
            PortalButton={
              <Button
                variant="outline"
                onClick={() => setOffset(0)}
              >
                Go to first page
              </Button>
            }
          />
        ) : styles.length === 0 && !search ? (
          <StateComponent
            message="No styles yet"
            ICON={<Shirt />}
            description="Get started by creating your first garment style. You can add manufacturing operations and per-piece rates to each style."
            PortalButton={
              <Button variant="outline" onClick={openCreateDialog}>
                <Plus className="size-4" />
                Create your first style
              </Button>
            }
          />
        ) : styles.length === 0 ? (
          <StateComponent
            message="No styles found"
            description="Try searching with a different name or style number."
            PortalButton={
              <Button variant="outline" onClick={clearSearch}>
                Clear search
              </Button>
            }
          />
        ) : (
          <>
            <StylesTable
              styles={styles}
              onEdit={openEditDialog}
              onDelete={(style) => {
                setDeletingStyle(style)
                setDeleteDialogOpen(true)
              }}
            />

            <Pagination
              limit={limit}
              offset={offset}
              itemCount={styles.length}
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

      {/* Create / Edit */}
      <StyleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingStyle={editingStyle}
        onSubmit={handleSave}
        isSaving={isSaving}
      />

      {/* Delete */}
      <DeleteStyleDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        style={deletingStyle}
        onDelete={handleDelete}
        isDeleting={isSaving}
        onCancel={() => setDeletingStyle(null)}
      />
    </div>
  )
}
