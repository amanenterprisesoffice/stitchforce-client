"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"

import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"

import EditUserDialog from "./components/edit-dialog"
import DeleteUserDialog from "./components/delete-dialog"
import { User } from "@/utils/types/user"
import UserDetails from "../components/details"
import UserDetailsHeader from "../components/details-header"
import UserQuickLinks from "../components/quicklinks"
import { useUser } from "@/contexts/UserContext"
import { UserX2Icon } from "lucide-react"
import Loader from "@/components/ui/Loader"

export default function UserDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const userID = params.id as string
  const { user: currentUser } = useUser()

  useEffect(() => {
    if (currentUser?.id === userID) {
      router.replace("/users/me")
    }
  }, [currentUser, userID, router])

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const {
    data: user,
    isLoading,
    refetch: refetchUser,
    error: userError,
  } = useFetch<User>({
    url: `/api/users/${userID}`,
    auto: !!userID,
  })

  const { refetch: updateUser, isLoading: isSaving } = useFetch()
  const { refetch: deleteUser, isLoading: isDeleting } = useFetch()

  const handleUpdate = async (formData: FormData) => {
    await updateUser({
      url: `/api/users/${userID}`,
      method: "PATCH",
      payload: formData,
      onSuccess: () => {
        setEditOpen(false)
        toast.success("User updated successfully")
        refetchUser()
      },
    })
  }

  const handleDelete = async () => {
    await deleteUser({
      url: `/api/users/${userID}`,
      method: "DELETE",
      onSuccess: () => {
        toast.success("User deleted")
        router.replace("/users")
      },
    })
  }

  if (isLoading) {
    return <Loader />
  }

  if (userError) {
    return (
      <StateComponent
        className="rounded-none"
        message={userError || "Something went wrong"}
        description="An error occurred while loading user details."
        ICON={<UserX2Icon />}
        PortalButton={
          <Button variant="outline" onClick={() => refetchUser()}>
            Try again
          </Button>
        }
      />
    )
  }

  if (!isLoading && !user) {
    return (
      <StateComponent
        className="rounded-none"
        message="User not found"
        description="Unable to load this user's information."
        PortalButton={
          <Button variant="outline" onClick={() => refetchUser()}>
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

      <UserQuickLinks />

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
        userName={user?.name}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </main>
  )
}
