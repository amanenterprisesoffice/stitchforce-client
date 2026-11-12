"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { formatDate, getInitials } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/utils/types/user"

import { CopyButton } from "@/components/ui/CopyButton"

interface Props {
  user: User
}

export default function UserDetails({ user }: Props) {
  return (
    <Card className="w-full min-w-0">
      <CardHeader className="border-b">
        <CardTitle className="text-base">User information</CardTitle>
        <CardDescription>
          Detailed information about the user
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full min-w-0">
        <div className="flex w-full min-w-0 flex-col gap-6 sm:flex-row">
          <Avatar className="size-24 shrink-0 sm:size-32">
            <AvatarImage
              src={user.photo_url || undefined}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl font-semibold">
              {user.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>

          <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 sm:border-l sm:pl-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="mt-1 break-words font-medium">
                {user.name || "—"}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="mt-1 break-words font-medium">
                {user.email || "—"}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="mt-1 font-medium capitalize">
                {user.role?.replaceAll("_", " ") || "—"}
              </p>
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-sm text-muted-foreground">User ID</p>
              <div className="flex items-center">
                <span className="break-all font-mono text-xs">
                  {user.id}
                </span>
                <CopyButton label="" value={user.id} />
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Created at</p>
              <p className="mt-1 font-medium">
                {formatDate(user.created_at)}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Last updated</p>
              <p className="mt-1 font-medium">
                {formatDate(user.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}