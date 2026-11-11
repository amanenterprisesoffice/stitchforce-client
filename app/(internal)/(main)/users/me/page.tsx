"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useUser } from "@/contexts/UserContext"
import useFetch from "@/hooks/useFetch"

import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"

import UserDetailsHeader from "../components/details-header"
import UserQuickLinks from "../components/quicklinks"
import EditUserDialog from "./components/edit-dialog"
import DeleteUserDialog from "./components/delete-dialog"
import UserDetails from "../components/details"

export default function ProfilePage() {
  const router = useRouter()
  const { user, refetch } = useUser()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { refetch: updateUser, isLoading: isSaving } = useFetch()
  const { refetch: deleteUser, isLoading: isDeleting } = useFetch()

  const handleUpdate = async (formData: FormData) => {
    await updateUser({
      url: "/api/users/me",
      method: "PATCH",
      payload: formData,
      onSuccess: () => {
        setEditOpen(false)
        toast.success("Profile updated successfully")
        refetch()
      },
    })
  }

  const handleDelete = async () => {
    await deleteUser({
      url: "/api/users/me",
      method: "DELETE",
      onSuccess: () => {
        toast.success("Account deleted")
        router.replace("/login")
      },
    })
  }

  if (!user) {
    return (
      <StateComponent
        className="rounded-none"
        message="User not found"
        description="Unable to load your account information."
        PortalButton={
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-5 p-4 md:p-6">
      <UserDetailsHeader
        user={user}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />

      <div className="mx-auto h-fit w-full">
        <UserDetails user={user} />
      </div>
      <UserQuickLinks user={user} />

      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        onSubmit={handleUpdate}
        isSaving={isSaving}
      />

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        userName={user.name}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </main>
  )
}
