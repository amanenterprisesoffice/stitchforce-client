"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shirt, Settings2, Plus } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import StyleOperationsTable, { type StyleOperation } from "./components/table"

import OperationFormDialog from "./components/form-dialog"
import DeleteOperationDialog from "./components/delete-dialog"

import type { OperationPayload } from "./schema"
import State from "@/components/StateComponent"
import StateComponent from "@/components/StateComponent"
import { Separator } from "@/components/ui/separator"
import Loader from "@/components/ui/Loader"
import PageHeader from "@/components/ui/PageHeader"
import StyleHeader from "./components/header"

interface Style {
  id: string
  organization_id: string
  name: string
  style_number: string
  description?: string
  created_at?: string
}

function formatRate(rateInPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(rateInPaise) / 100)
}

export default function StyleDetailsPage() {
  const params = useParams()
  const styleID = params.id as string

  const { user } = useUser()
  const organizationID = user?.organization_id

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingOperation, setEditingOperation] =
    useState<StyleOperation | null>(null)

  const [deletingOperation, setDeletingOperation] =
    useState<StyleOperation | null>(null)

  const baseURL =
    organizationID && styleID
      ? `/api/organizations/${organizationID}/styles/${styleID}`
      : ""

  // Fetch style
  const { data: styleData, isLoading: styleLoading } = useFetch({
    auto: true,
    url: baseURL,
  })

  const style = styleData ?? null
  // Fetch operations
  const {
    data: styleOperationsData,
    refetch: fetchOperations,
    isLoading: operationsLoading,
  } = useFetch({
    auto: true,
    url: `${baseURL}/operations`,
  })

  const operations: StyleOperation[] = styleOperationsData ?? []

  // Create operation
  const { refetch: createOperation, isLoading: creating } = useFetch({
    auto: false,
  })

  // Update operation
  const { refetch: updateOperation, isLoading: updating } = useFetch({
    auto: false,
  })

  // Delete operation
  const { refetch: deleteOperation, isLoading: deleting } = useFetch({
    auto: false,
  })

  const isSaving = creating || updating

  // Create dialog
  const openCreateDialog = () => {
    setEditingOperation(null)
    setDialogOpen(true)
  }

  // Edit dialog
  const openEditDialog = (operation: StyleOperation) => {
    setEditingOperation(operation)
    setDialogOpen(true)
  }

  // Save operation
  const handleSave = async (values: OperationPayload) => {
    if (!baseURL) return

    const isEditing = !!editingOperation

    const payload = {
      name: values.name,
      rate_per_piece: values.rate_per_piece,
    }

    const onSuccess = () => {
      toast.success(
        isEditing
          ? "Operation updated successfully"
          : "Operation created successfully"
      )

      setDialogOpen(false)
      setEditingOperation(null)

      fetchOperations({
        url: `${baseURL}/operations`,
        method: "GET",
      })
    }

    const onError = (err: any) => {
      toast.error(err?.message || "Failed to save operation")
    }

    if (editingOperation) {
      await updateOperation({
        url: `${baseURL}/operations/${editingOperation.id}`,
        method: "PUT",
        payload,
        onSuccess,
        onError,
      })
    } else {
      await createOperation({
        url: `${baseURL}/operations`,
        method: "POST",
        payload,
        onSuccess,
        onError,
      })
    }
  }

  // Delete operation
  const handleDelete = async () => {
    if (!deletingOperation || !baseURL) return

    await deleteOperation({
      url: `${baseURL}/operations/${deletingOperation.id}`,
      method: "DELETE",

      onSuccess: () => {
        toast.success("Operation deleted successfully")

        setDeletingOperation(null)

        fetchOperations({
          url: `${baseURL}/operations`,
          method: "GET",
        })
      },

      onError: (err: any) => {
        toast.error(err?.message || "Failed to delete operation")
      },
    })
  }

  // Loading style
  if (styleLoading && !style) {
    return <Loader />
  }

  // Style not found
  if (!style) {
    return (
      <StateComponent
        message="Style not found"
        description="The requested style could not be found."
        PortalButton={
          <Button variant="outline" render={<Link href="/styles" />}>
            <ArrowLeft className="mr-2 size-4" />
            Back to styles
          </Button>
        }
      />
    )
  }

  // Total rate in paise
  const totalRate = operations.reduce(
    (total, operation) => total + Number(operation.rate_per_piece),
    0
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <StyleHeader style={style} openCreateDialog={openCreateDialog} />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-none">
          <CardContent className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Operations
              </p>

              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {operations.length}
              </p>

              <p className="text-xs text-muted-foreground">
                Manufacturing steps configured
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Settings2 className="size-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardContent className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Rate Per Piece
              </p>

              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {formatRate(totalRate)}
              </p>

              <p className="text-xs text-muted-foreground">
                Combined rate across all operations
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-xl font-semibold text-primary">₹</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations Table */}
      {operationsLoading ? (
        <Loader />
      ) : operations.length === 0 ? (
        <StateComponent
          message="No operations yet"
          ICON={<Settings2 className="size-8 text-muted-foreground" />}
          description="Add manufacturing operations and their per-piece rates."
          PortalButton={
            <Button variant="outline" onClick={openCreateDialog}>
              <Plus className="size-4" />
              Add Operation
            </Button>
          }
        />
      ) : (
        <StyleOperationsTable
          operations={operations}
          onEdit={openEditDialog}
          onDelete={setDeletingOperation}
        />
      )}

      {/* Create / Edit */}
      <OperationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingOperation={editingOperation}
        onSubmit={handleSave}
        isSaving={isSaving}
      />

      {/* Delete */}
      <DeleteOperationDialog
        open={!!deletingOperation}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeletingOperation(null)
          }
        }}
        operation={deletingOperation}
        onDelete={handleDelete}
        isDeleting={deleting}
        onCancel={() => setDeletingOperation(null)}
      />
    </div>
  )
}
