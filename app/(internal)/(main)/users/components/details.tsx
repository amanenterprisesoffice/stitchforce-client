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
import { User } from "@/utils/types/user"

interface Props {
  user: User
}

export default function UserDetails({ user }: Props) {
  return (
    <Card className="w-full min-w-0">
      <CardHeader>
        <CardTitle className="text-base">User information</CardTitle>
        <CardDescription>
          Detailed information about the user
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full min-w-0">
        <div className="flex w-full min-w-0 flex-col gap-6 sm:flex-row">
          {user.photo_url && (
            <Avatar className="size-24 shrink-0 sm:size-32">
              <AvatarImage
                src={user.photo_url}
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={`grid w-full min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-3 ${
              user.photo_url ? "sm:border-l sm:pl-6" : ""
            }`}
          >
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

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="mt-1 break-all font-mono text-xs">
                {user.id}
              </p>
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