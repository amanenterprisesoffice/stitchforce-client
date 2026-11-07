
"use client"

import { useEffect, useMemo, useState } from "react"
import { PencilRuler, Search } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import type { Size, SizeFormValues } from "@/utils/zodSchema/size"

import SizesHeader from "./components/header"
import SizesTable from "./components/table"
import SizeFormDialog from "./components/form-dialog"
import State from "@/components/StateComponent"
import DeleteSizeDialog from "./components/delete-size-dialog"
import StateComponent from "@/components/StateComponent"

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

    return sizes.filter((size) =>
      size.name?.toLowerCase().includes(query)
    )
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
      url: isEditing
        ? `${sizesURL}/${editingSize.id}`
        : sizesURL,

      method: isEditing ? "PUT" : "POST",

      payload: {
        name,
      },

      onSuccess: () => {
        toast.success(
          isEditing
            ? "Size updated successfully"
            : "Size created successfully"
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
      <SizesHeader
        count={sizes.length}
        onCreate={openCreateDialog}
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search sizes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="relative flex flex-1">
        {/* Loading */}
        {isLoading && !sizesData ? (
          <Loader text="Loading sizes" />
        ) : !isLoading &&sizes.length === 0 ? (
          <State
            message="No sizes yet"
            // use relavatn icon
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
          <State
            message="No sizes found"
            description="Try searching with a different size name."
            PortalButton={
              <Button
                variant="outline"
                onClick={() => setSearch("")}
              >
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
