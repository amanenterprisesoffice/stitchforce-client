"use client"

import { usePathname } from "next/navigation"
import { Pencil, Trash2, UserRound, Share2, Copy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"
import { User } from "@/utils/types/user"
import { useUser } from "@/contexts/UserContext"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSIONS } from "@/constants/permissions"

interface Props {
  user: User | null
  onEdit: () => void
  onDelete: () => void
}

export default function UserDetailsHeader({ user, onEdit, onDelete }: Props) {
  const pathname = usePathname()
  const { user: currentUser } = useUser()
  const { hasPermission } = usePermissions()

  if (!user) return null

  const isOwnProfile = pathname === "/users/me" && user.id === currentUser?.id

  const canManageUsers = hasPermission(PERMISSIONS.USERS_MANAGE)

  const canEdit = isOwnProfile || canManageUsers
  const canDelete = isOwnProfile || canManageUsers

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success("User link copied")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: user.name,
          url: window.location.href,
        })
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error("Unable to share user")
        }
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <PageHeader
      title={user.name}
      icon={<UserRound className="size-5 text-muted-foreground" />}
      action={
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            title="Share user"
          >
            <Share2 className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyLink}
            title="Copy user link"
          >
            <Copy className="size-4" />
          </Button>

          {canEdit && (
            <Button variant="outline" onClick={onEdit}>
              <Pencil className="mr-2 size-4" />
              Edit
            </Button>
          )}

          {canDelete && (
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
          )}
        </>
      }
    />
  )
}
