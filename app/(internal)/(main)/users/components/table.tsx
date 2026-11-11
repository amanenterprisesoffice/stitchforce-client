"use client"

import { useRouter } from "next/navigation"
import { Mail, ShieldCheck } from "lucide-react"
import { useUser } from "@/contexts/UserContext"

import type { User } from "@/utils/types/user"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/DataTable"

import { formatDate, getInitials } from "@/utils/utils"

interface Props {
  users: User[]
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

export default function UsersTable({ users }: Props) {
  const router = useRouter()
  const { user } = useUser()
  const isCurrentUser = (userId: string) => user?.id === userId

  const columns = [
    {
      header: "User",
      render: (user: User) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-10 shrink-0">
            <AvatarImage
              src={user.photo_url || undefined}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate font-medium">
              {user.name || "Unnamed user"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      render: (user: User) => (
        <Badge variant="secondary" className="whitespace-nowrap">
          {displayRole(user.role)}
        </Badge>
      ),
    },
    {
      header: "Email status",
      className: "hidden sm:table-cell",
      render: (user: User) =>
        user.email_verified_at ? (
          <Badge variant="outline" className="gap-1">
            <ShieldCheck className="size-3" />
            Verified
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1">
            <Mail className="size-3" />
            Unverified
          </Badge>
        ),
    },
    {
      header: "Joined",
      className: "whitespace-nowrap text-right",
      render: (user: User) => formatDate(user.created_at),
    },
  ]

  return (
    <DataTable
      data={users}
      columns={columns}
      getRowId={(user) => user.id}
      onRowClick={(user) =>
        router.push(isCurrentUser(user.id) ? `/users/me` : `/users/${user.id}`)
      }
      emptyMessage="No users found."
    />
  )
}
