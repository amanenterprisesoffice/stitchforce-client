"use client"

import { Bell, CheckCheck } from "lucide-react"
import PageHeader from "@/components/ui/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Props {
  count: number
  unreadCount: number
  onMarkAllAsRead: () => void
  isMarkingAllAsRead: boolean
}

export default function NotificationsHeader({ count, unreadCount, onMarkAllAsRead, isMarkingAllAsRead }: Props) {
  return (
    <PageHeader
      title="Notifications"
      description="Stay updated with activity and important updates."
      icon={<Bell className="size-5 text-muted-foreground" />}
      badge={<Badge variant="secondary">{count}</Badge>}
      action={unreadCount > 0 ? (
        <Button variant="outline" onClick={onMarkAllAsRead} disabled={isMarkingAllAsRead}>
          <CheckCheck className="size-4" />
          Mark all as read
        </Button>
      ) : undefined}
    />
  )
}
