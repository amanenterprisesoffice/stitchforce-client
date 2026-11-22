"use client"

import { useState } from "react"
import { Bell, CalendarDays, ExternalLink, Trash2 } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Loader from "@/components/ui/Loader"

import { formatDate } from "@/utils/utils"
import type { Notification } from "@/utils/types/notifications"
import { formatNotificationType } from "@/utils/types/notifications"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import NotificationDetailsTable from "./details-table"

interface Props {
  notification: Notification | null
  onDeleted: (id: string) => void
}

export default function NotificationDetails({
  notification,
  onDeleted,
}: Props) {
  const { isLoading, refetch: deleteNotification } = useFetch({
    auto: false,
  })

  const handleDelete = async () => {
    if (!notification) return

    await deleteNotification({
      url: `/api/users/notifications/${notification.id}`,
      method: "DELETE",
      onSuccess: () => {
        toast.success("Notification deleted")
        onDeleted(notification.id)
      },
    })
  }

  if (!notification) {
    return (
      <aside className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border bg-card p-6 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
          <Bell className="size-5 text-muted-foreground" />
        </div>

        <p className="font-medium">Notification details</p>
        <p className="mt-1 max-w-[220px] text-sm text-muted-foreground">
          Select a notification from the table to view its details here.
        </p>
      </aside>
    )
  }

  return (
    <Card className="h-fit">
      <CardHeader className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <Bell className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="font-medium">Notification details</p>
            <p className="text-xs text-muted-foreground">
              {notification.read_at
                ? `Read at ${formatDate(notification.read_at)}`
                : "Unread"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isLoading}
          onClick={handleDelete}
          title="Delete notification"
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {formatNotificationType(notification.type)}
          </Badge>

          {!notification.read_at && <Badge>New</Badge>}
        </div>

        <h3 className="text-base leading-snug font-semibold">
          {notification.title}
        </h3>

        <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {notification.message}
        </p>

        <NotificationDetailsTable notification={notification} />
      </CardContent>

      {notification.action_url && (
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => window.location.assign(notification.action_url)}
          >
            View details
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
