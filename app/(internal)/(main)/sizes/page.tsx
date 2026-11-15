"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, PencilRuler, Search } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import type { Size, SizeFormValues } from "@/utils/types/size"

import SizesHeader from "./components/header"
import SizesTable from "./components/table"
import SizeFormDialog from "./components/form-dialog"
import DeleteSizeDialog from "./components/delete-size-dialog"
import StateComponent from "@/components/StateComponent"
import DebouncedSearch from "@/components/ui/debounced-search"

export default function SizesPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [editingSize, setEditingSize] = useState<Size | null>(null)
  const [deletingSize, setDeletingSize] = useState<Size | null>(null)

  const sizesURL = organizationID
    ? `/api/organizations/${organizationID}/sizes`
    : ""

  // GET sizes
  const {
    data: sizesData,
    isLoading,
    refetch: fetchSizes,
    error: sizesError,
  } = useFetch({
    url: sizesURL,
    method: "GET",
  })

  // POST, PUT and DELETE
  const { isLoading: isSaving, refetch: mutateSize } = useFetch()

  const sizes: Size[] = Array.isArray(sizesData)
    ? sizesData
    : (sizesData?.sizes ?? [])

  // Fetch when organization becomes available
  useEffect(() => {
    if (!organizationID) return

    fetchSizes({
      url: `/api/organizations/${organizationID}/sizes`,
    })
  }, [organizationID, fetchSizes])

  // Search
  const filteredSizes = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return sizes

    return sizes.filter((size) => size.name?.toLowerCase().includes(query))
  }, [sizes, search])

  // Create
  const openCreateDialog = () => {
    setEditingSize(null)
    setDialogOpen(true)
  }

  // Edit
  const openEditDialog = (size: Size) => {
    setEditingSize(size)
    setDialogOpen(true)
  }

  // Save (POST / PUT)
  const handleSave = async (values: SizeFormValues) => {
    if (!organizationID) {
      toast.error("Organization not found")
      return
    }

    const name = values.name.trim()

    // Prevent duplicate size names within the organization
    const duplicateSize = sizes.some(
      (size) =>
        size.name.trim().toLowerCase() === name.toLowerCase() &&
        size.id !== editingSize?.id
    )

    if (duplicateSize) {
      toast.error("This size already exists")
      return
    }

    const isEditing = !!editingSize

    await mutateSize({
      url: isEditing ? `${sizesURL}/${editingSize.id}` : sizesURL,

      method: isEditing ? "PUT" : "POST",

      payload: {
        name,
      },

      onSuccess: () => {
        toast.success(
          isEditing ? "Size updated successfully" : "Size created successfully"
        )

        setDialogOpen(false)
        setEditingSize(null)

        fetchSizes({
          url: sizesURL,
        })
      },
    })
  }

  // Delete
  const handleDelete = async () => {
    if (!deletingSize || !organizationID) return

    await mutateSize({
      url: `${sizesURL}/${deletingSize.id}`,
      method: "DELETE",

      onSuccess: () => {
        toast.success("Size deleted successfully")

        setDeleteDialogOpen(false)
        setDeletingSize(null)

        fetchSizes({
          url: sizesURL,
        })
      },
    })
  }

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Error"
        description="Something went wrong "
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <SizesHeader onCreate={openCreateDialog} />

      {/* Search */}
      <div className="relative max-w-sm">
        <DebouncedSearch value={search} onChange={setSearch} />
      </div>

      <div className="relative flex flex-1">
        {/* Loading */}
        {isLoading && !sizesData ? (
          <Loader text="Loading sizes" />
        ) : sizesError ? (
          <StateComponent
            className="rounded-none"
            message={sizesError || "Something went wrong"}
            description="An error occurred while loading sizes."
            ICON={<AlertCircle />}
          />
        ) : !isLoading && sizes.length === 0 ? (
          <StateComponent
            message="No sizes yet"
            ICON={<PencilRuler />}
            description="Get started by creating your first size. These reusable sizes can be assigned to garment bundles."
            PortalButton={
              <Button variant="outline" onClick={openCreateDialog}>
                Create your first size
              </Button>
            }
          />
        ) : !isLoading && filteredSizes.length === 0 ? (
          /* No search results */
          <StateComponent
            message="No sizes found"
            description="Try searching with a different size name."
            PortalButton={
              <Button variant="outline" onClick={() => setSearch("")}>
                Clear search
              </Button>
            }
          />
        ) : (
          /* Sizes table */
          <SizesTable
            sizes={filteredSizes}
            onEdit={openEditDialog}
            isLoading={isLoading}
            onDelete={(size) => {
              setDeletingSize(size)
              setDeleteDialogOpen(true)
            }}
          />
        )}
      </div>

      {/* Create / Edit */}
      <SizeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingSize={editingSize}
        onSubmit={handleSave}
        isSaving={isSaving}
      />

      {/* Delete */}
      <DeleteSizeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        size={deletingSize}
        onDelete={handleDelete}
        isDeleting={isSaving}
        onCancel={() => setDeletingSize(null)}
      />
    </div>
  )
}
