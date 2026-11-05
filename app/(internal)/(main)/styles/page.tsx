"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Search, Shirt } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import type { Style } from "../../../../utils/zodSchema/style"

import StylesHeader from "./components/header"
import StylesTable from "./components/table"
import StyleFormDialog from "./components/form-dialog"
import DeleteStyleDialog from "./components/delete-style-dialog"
import State from "@/components/StateComponent"
import StateComponent from "@/components/StateComponent"

export default function StylesPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [editingStyle, setEditingStyle] = useState<Style | null>(null)
  const [deletingStyle, setDeletingStyle] = useState<Style | null>(null)

  const stylesURL = organizationID
    ? `/api/organizations/${organizationID}/styles`
    : ""

  // GET styles
  const {
    data: stylesData,
    isLoading,
    refetch: fetchStyles,
  } = useFetch({
    url: stylesURL,
    method: "GET",
  })

  // POST, PUT and DELETE
  const { isLoading: isSaving, refetch: mutateStyle } = useFetch()

  const styles: Style[] = Array.isArray(stylesData)
    ? stylesData
    : (stylesData?.styles ?? [])

  // Fetch when organization becomes available
  useEffect(() => {
    if (!organizationID) return

    fetchStyles({
      url: `/api/organizations/${organizationID}/styles`,
      method: "GET",
      onError: (error: any) => {
        toast.error(error?.message || "Failed to fetch styles")
      },
    })
  }, [organizationID, fetchStyles])

  // Search
  const filteredStyles = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return styles

    return styles.filter(
      (style) =>
        style.name?.toLowerCase().includes(query) ||
        style.style_number?.toLowerCase().includes(query) ||
        style.description?.toLowerCase().includes(query)
    )
  }, [styles, search])

  // Create
  const openCreateDialog = () => {
    setEditingStyle(null)
    setDialogOpen(true)
  }

  // Edit
  const openEditDialog = (style: Style) => {
    setEditingStyle(style)
    setDialogOpen(true)
  }

  // Save (POST / PUT)
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

        fetchStyles({
          url: stylesURL,
          method: "GET",
        })
      },

      onError: (error: any) => {
        toast.error(error?.message || "Failed to save style")
      },
    })
  }

  // Delete
  const handleDelete = async () => {
    if (!deletingStyle || !organizationID) return

    await mutateStyle({
      url: `${stylesURL}/${deletingStyle.id}`,
      method: "DELETE",

      onSuccess: () => {
        toast.success("Style deleted successfully")

        setDeleteDialogOpen(false)
        setDeletingStyle(null)

        fetchStyles({
          url: stylesURL,
          method: "GET",
        })
      },

      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete style")
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
      <StylesHeader count={styles.length} onCreate={openCreateDialog} />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search styles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="relative flex flex-1">
        {/* Loading */}
        {isLoading && !stylesData ? (
          <Loader text="Loading styles" />
        ) : styles.length === 0 ? (
          <State
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
        ) : filteredStyles.length === 0 ? (
          /* No search results */
          <State
            message="No styles found"
            description="Try searching with a different name or style number."
            PortalButton={
              <Button variant="outline" onClick={() => setSearch("")}>
                Clear search
              </Button>
            }
          />
        ) : (
          /* Styles table */
          <StylesTable
            styles={filteredStyles}
            onEdit={openEditDialog}
            onDelete={(style) => {
              setDeletingStyle(style)
              setDeleteDialogOpen(true)
            }}
          />
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
