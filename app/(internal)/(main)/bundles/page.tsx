"use client"

import { useEffect, useMemo, useState } from "react"
import { Link, PackagePlus, Search } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import State from "@/components/StateComponent"

import type { Bundle, BundleFormValues } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { Size } from "@/utils/zodSchema/size"

import BundlesHeader from "./components/header"
import BundlesTable from "./components/table"
import BundleFormDialog from "./components/form-dialog"
import DeleteBundleDialog from "./components/delete-bundle-dialog"
import BundleFilters from "./components/filters"
import StateComponent from "@/components/StateComponent"

export default function BundlesPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const [search, setSearch] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null)
  const [viewingBundle, setViewingBundle] = useState<Bundle | null>(null)
  const [deletingBundle, setDeletingBundle] = useState<Bundle | null>(null)

  const [styleFilter, setStyleFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const bundlesURL = organizationID
    ? `/api/organizations/${organizationID}/bundles`
    : ""

  const stylesURL = organizationID
    ? `/api/organizations/${organizationID}/styles`
    : ""

  const sizesURL = organizationID
    ? `/api/organizations/${organizationID}/sizes`
    : ""

  // GET bundles
  const {
    data: bundlesData,
    isLoading: isBundlesLoading,
    refetch: fetchBundles,
  } = useFetch({
    url: bundlesURL,
    method: "GET",
  })

  // GET styles
  const {
    data: stylesData,
    isLoading: isStylesLoading,
    refetch: fetchStyles,
  } = useFetch({
    url: stylesURL,
    method: "GET",
  })

  // GET sizes
  const {
    data: sizesData,
    isLoading: isSizesLoading,
    refetch: fetchSizes,
  } = useFetch({
    url: sizesURL,
    method: "GET",
  })

  // POST, PUT and DELETE
  const { isLoading: isSaving, refetch: mutateBundle } = useFetch()

  const bundles: Bundle[] = Array.isArray(bundlesData)
    ? bundlesData
    : (bundlesData?.bundles ?? [])

  const styles: Style[] = Array.isArray(stylesData)
    ? stylesData
    : (stylesData?.styles ?? [])

  const sizes: Size[] = Array.isArray(sizesData)
    ? sizesData
    : (sizesData?.sizes ?? [])

  // Fetch organization resources
  useEffect(() => {
    if (!organizationID) return

    fetchBundles({
      url: bundlesURL,
      method: "GET",
      onError: (error: any) => {
        toast.error(error?.message || "Failed to fetch bundles")
      },
    })

    fetchStyles({
      url: stylesURL,
      method: "GET",
      onError: (error: any) => {
        toast.error(error?.message || "Failed to fetch styles")
      },
    })

    fetchSizes({
      url: sizesURL,
      method: "GET",
      onError: (error: any) => {
        toast.error(error?.message || "Failed to fetch sizes")
      },
    })
  }, [organizationID, fetchBundles, fetchStyles, fetchSizes])

  // Style and size lookup
  const styleMap = useMemo(
    () => new Map(styles.map((style) => [style.id, style.name])),
    [styles]
  )

  const sizeMap = useMemo(
    () => new Map(sizes.map((size) => [size.id, size.name])),
    [sizes]
  )

  // Search and filters
  const filteredBundles = useMemo(() => {
    const query = search.toLowerCase().trim()

    return bundles.filter((bundle) => {
      const matchesSearch =
        !query ||
        bundle.bundle_number?.toLowerCase().includes(query) ||
        styleMap.get(bundle.style_id)?.toLowerCase().includes(query) ||
        sizeMap.get(bundle.size_id)?.toLowerCase().includes(query)

      const matchesStyle =
        styleFilter === "all" || bundle.style_id === styleFilter

      const matchesSize = sizeFilter === "all" || bundle.size_id === sizeFilter

      const matchesStatus =
        statusFilter === "all" || bundle.status === statusFilter

      return matchesSearch && matchesStyle && matchesSize && matchesStatus
    })
  }, [
    bundles,
    search,
    styleFilter,
    sizeFilter,
    statusFilter,
    styleMap,
    sizeMap,
  ])

  // Create
  const openCreateDialog = () => {
    setEditingBundle(null)
    setDialogOpen(true)
  }

  // Edit
  const openEditDialog = (bundle: Bundle) => {
    setEditingBundle(bundle)
    setDialogOpen(true)
  }

  // View


  // Save (POST / PUT)
  const handleSave = async (values: BundleFormValues) => {
    if (!organizationID) {
      toast.error("Organization not found")
      return
    }

    const bundleNumber = values.bundle_number.trim()

    // Prevent duplicate bundle numbers within organization
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

        fetchBundles({
          url: bundlesURL,
          method: "GET",
        })
      },

      onError: (error: any) => {
        toast.error(error?.message || "Failed to save bundle")
      },
    })
  }

  // Delete
  const handleDelete = async () => {
    if (!deletingBundle || !organizationID) return

    await mutateBundle({
      url: `${bundlesURL}/${deletingBundle.id}`,
      method: "DELETE",

      onSuccess: () => {
        toast.success("Bundle deleted successfully")

        setDeleteDialogOpen(false)
        setDeletingBundle(null)

        fetchBundles({
          url: bundlesURL,
          method: "GET",
        })
      },

      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete bundle")
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

  const isLoading =
    (isBundlesLoading && !bundlesData) ||
    (isStylesLoading && !stylesData) ||
    (isSizesLoading && !sizesData)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <BundlesHeader count={bundles.length} onCreate={openCreateDialog} />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search bundles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <BundleFilters
        styles={styles}
        sizes={sizes}
        styleFilter={styleFilter}
        sizeFilter={sizeFilter}
        statusFilter={statusFilter}
        onStyleChange={setStyleFilter}
        onSizeChange={setSizeFilter}
        onStatusChange={setStatusFilter}
        onClear={() => {
          setStyleFilter("all")
          setSizeFilter("all")
          setStatusFilter("all")
          setSearch("")
        }}
      />

      <div className="relative flex flex-1">
        {isLoading ? (
          <Loader text="Loading bundles" />
        ) : bundles.length === 0 ? (
          <State
            message="No bundles yet"
            ICON={<PackagePlus />}
            description="Create your first garment bundle by assigning an existing style, size, quantity, and manufacturing attributes."
            PortalButton={
              <Button variant="outline" onClick={openCreateDialog}>
                Create your first bundle
              </Button>
            }
          />
        ) : filteredBundles.length === 0 ? (
          <State
            message="No bundles found"
            description="Try changing your search or filters."
            PortalButton={
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("")
                  setStyleFilter("all")
                  setSizeFilter("all")
                  setStatusFilter("all")
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <BundlesTable
            bundles={filteredBundles}
            styles={styles}
            sizes={sizes}
            onEdit={openEditDialog}
            onDelete={(bundle) => {
              setDeletingBundle(bundle)
              setDeleteDialogOpen(true)
            }}
          />
        )}
      </div>

      {/* Create / Edit */}
      <BundleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingBundle={editingBundle}
        styles={styles}
        sizes={sizes}
        onSubmit={handleSave}
        isSaving={isSaving}
      />

      {/* Delete */}
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
