"use client"

import { useRouter } from "next/navigation"
import { Mail, ShieldCheck, Clock } from "lucide-react"
import { useUser } from "@/contexts/UserContext"

import type { User } from "@/utils/types/user"
import type { OrganizationInvitation } from "@/utils/types/organization"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/DataTable"

import { formatDate, getInitials } from "@/utils/utils"

interface Props {
  users: User[]
  invitations: OrganizationInvitation[]
  onInvitationClick: (invitation: OrganizationInvitation) => void
}

type UserTableRow =
  | {
      type: "user"
      id: string
      user: User
    }
  | {
      type: "invitation"
      id: string
      invitation: OrganizationInvitation
    }

function displayRole(role: string) {
  switch (role) {
    case "org_admin":
      return "Organization admin"
    case "admin":
      return "Admin"
    case "staff":
      return "Staff"
    default:
      return role
  }
}

export default function UsersTable({
  users,
  invitations,
  onInvitationClick,
}: Props) {
  const router = useRouter()
  const { user: currentUser } = useUser()

  const data: UserTableRow[] = [
    ...users.map((user) => ({
      type: "user" as const,
      id: user.id,
      user,
    })),
    ...invitations.map((invitation) => ({
      type: "invitation" as const,
      id: invitation.id,
      invitation,
    })),
  ]

  const columns = [
    {
      header: "User",
      render: (row: UserTableRow) => {
        if (row.type === "invitation") {
          return (
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-10 shrink-0">
                <AvatarFallback>
                  <Mail className="size-4" />
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate font-medium">
                  {row.invitation.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Invitation pending
                </p>
              </div>
            </div>
          )
        }

        return (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage
                src={row.user.photo_url || undefined}
                alt={row.user.name}
                className="object-cover"
              />
              <AvatarFallback>
                {getInitials(row.user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate font-medium">
                {row.user.name || "Unnamed user"}
                {currentUser?.id === row.user.id && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (You)
                  </span>
                )}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {row.user.email}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      header: "Role",
      render: (row: UserTableRow) => {
        const role =
          row.type === "user" ? row.user.role : row.invitation.role

        return (
          <Badge variant="secondary" className="whitespace-nowrap">
            {displayRole(role)}
          </Badge>
        )
      },
    },
    {
      header: "Status",
      className: "hidden sm:table-cell",
      render: (row: UserTableRow) => {
        if (row.type === "invitation") {
          return (
            <Badge variant="outline" className="gap-1">
              <Clock className="size-3" />
              Pending invitation
            </Badge>
          )
        }

        return row.user.email_verified_at ? (
          <Badge variant="outline" className="gap-1">
            <ShieldCheck className="size-3" />
            Verified
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1">
            <Mail className="size-3" />
            Unverified
          </Badge>
        )
      },
    },
    {
      header: "Joined / Invited",
      className: "whitespace-nowrap text-right",
      render: (row: UserTableRow) => {
        if (row.type === "invitation") {
          return (
            <div className="text-right">
              <p>{formatDate(row.invitation.created_at)}</p>
              <p className="text-xs text-muted-foreground">
                Expires {formatDate(row.invitation.expires_at)}
              </p>
            </div>
          )
        }

        return formatDate(row.user.created_at)
      },
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(row) => `${row.type}-${row.id}`}
      onRowClick={(row) => {
        if (row.type === "invitation") {
          onInvitationClick(row.invitation)
          return
        }

        router.push(
          currentUser?.id === row.user.id
            ? "/users/me"
            : `/users/${row.user.id}`
        )
      }}
      emptyMessage="No users found."
    />
  )
}