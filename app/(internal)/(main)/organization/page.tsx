"use client"

import { useState } from "react"
import { toast } from "sonner"

import { useUser } from "@/contexts/UserContext"
import { useOrganization } from "@/contexts/OrganizationContext"

import StateComponent from "@/components/StateComponent"

import OrganizationHeader from "./components/header"
import OrganizationDetails from "./components/details"
import OrganizationQuickLinks from "./components/quick-links"
import EditOrganizationDialog from "./components/edit-organization-dialog"
import DeleteOrganizationDialog from "./components/delete-organization-dialog"

import { ADMIN, ORG_ADMIN } from "@/utils/types/user"
import LicenseWarning from "./components/license-banner"

export default function OrganizationPage() {
  const { user } = useUser()

  const { organization, update, remove, isUpdating, isDeleting } =
    useOrganization()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const organizationID = user?.organization_id

  const canManageOrganization = user?.role === ADMIN || user?.role === ORG_ADMIN

  const handleUpdate = async (formData: FormData) => {
    if (!canManageOrganization) {
      toast.error("You don't have permission to update this organization")
      return
    }

    if (!organizationID) return

    await update(formData)

    toast.success("Organization updated successfully")
    setEditOpen(false)
  }

  const handleDelete = async () => {
    if (!canManageOrganization) {
      toast.error("You don't have permission to delete this organization")
      return
    }

    if (!organizationID) return

    await remove()

    toast.success("Organization deleted successfully")
    setDeleteOpen(false)
    window.location.href = "/"
  }

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Organization not found"
        description="Your account is not associated with an organization."
      />
    )
  }

  if (!organization) {
    return (
      <StateComponent
        className="rounded-none"
        message="Unable to load organization"
        description="The organization details could not be retrieved."
      />
    )
  }

  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-5 p-4 md:p-6">
      <OrganizationHeader
        organization={organization}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />

        <LicenseWarning organization={organization} />

      <OrganizationDetails organization={organization} />
      <OrganizationQuickLinks organization={organization} />

      <EditOrganizationDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        organization={organization}
        onSubmit={handleUpdate}
        isSaving={isUpdating}
      />

      <DeleteOrganizationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        organization={organization}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </main>
  )
}
