"use client"

import { toast } from "sonner"
import { Mail, RefreshCw, Trash2 } from "lucide-react"

import useFetch from "@/hooks/useFetch"

import type { OrganizationInvitation } from "@/utils/types/organization"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { formatDate } from "@/utils/utils"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  invitation: OrganizationInvitation | null
  organizationID: string
  onUpdated: () => void
}

function displayRole(role: string) {
  switch (role) {
    case "org_admin":
      return "Organization admin"
    case "staff":
      return "Staff"
    default:
      return role
  }
}

export default function EditInviteDialog({
  open,
  onOpenChange,
  invitation,
  organizationID,
  onUpdated,
}: Props) {
  const {
    isLoading: isResending,
    refetch: resendInvitation,
  } = useFetch()

  const {
    isLoading: isCancelling,
    refetch: cancelInvitation,
  } = useFetch()

  if (!invitation) return null

  const baseURL = `/api/organizations/${organizationID}/invitations`

  const handleResend = async () => {
    await resendInvitation({
      url: `${baseURL}/${invitation.id}/resend`,
      method: "POST",
      onSuccess: () => {
        toast.success("Invitation resent successfully")
        onUpdated()
      },
    })
  }

  const handleCancel = async () => {
    await cancelInvitation({
      url: `${baseURL}/${invitation.id}`,
      method: "DELETE",
      onSuccess: () => {
        toast.success("Invitation cancelled")
        onUpdated()
      },
    })
  }

  const isLoading = isResending || isCancelling

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitation details</DialogTitle>
          <DialogDescription>
            Manage this pending organization invitation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
              <Mail className="size-5 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="break-all font-medium">
                {invitation.email}
              </p>
              <Badge variant="outline" className="mt-1">
                Pending invitation
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="mt-1 font-medium">
                {displayRole(invitation.role)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Invited on</p>
              <p className="mt-1 font-medium">
                {formatDate(invitation.created_at)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Expires on</p>
              <p className="mt-1 font-medium">
                {formatDate(invitation.expires_at)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="mt-1 font-medium">Not accepted</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 size-4" />
            Cancel invitation
          </Button>

          <Button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 size-4" />
            {isResending ? "Resending..." : "Resend invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}