"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, CheckCheck, ExternalLink } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { formatDate } from "@/utils/utils"

import type { Notification } from "@/utils/types/notifications"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Loader from "@/components/ui/Loader"
import ScrollShadow from "@/components/ui/ScrollShadow"

const POLL_INTERVAL = 30_000
const MAX_NOTIFICATIONS = 5

interface NotificationsResponse {
  notifications?: Notification[]
  data?:
    | Notification[]
    | {
        notifications?: Notification[]
      }
}

interface UnreadCountResponse {
  unread_count?: number
  count?: number
  data?: {
    unread_count?: number
  }
}

export default function NotificationsPopover() {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const { isLoading: isLoadingNotifications, refetch: fetchNotifications } =
    useFetch<NotificationsResponse>({
      auto: false,
      showErrorToast: false,
    })

  const { refetch: fetchUnreadCount } = useFetch<UnreadCountResponse>({
    auto: false,
    showErrorToast: false,
  })

  const { isLoading: isMarkingAllAsRead, refetch: markAllAsRead } = useFetch({
    auto: false,
  })

  const fetchData = () => {
    fetchUnreadCount({
      url: "/api/users/notifications/unread-count",
      onSuccess: (response) => {
        const count =
          response.unread_count ??
          response.count ??
          response.data?.unread_count ??
          0

        setUnreadCount(count)
      },
    })

    fetchNotifications({
      url: `/api/users/notifications?limit=${MAX_NOTIFICATIONS}&offset=0`,
      onSuccess: (response) => {
        const data = Array.isArray(response)
          ? response
          : (response.notifications ??
            (Array.isArray(response.data)
              ? response.data
              : response.data?.notifications) ??
            [])

        setNotifications(data.slice(0, MAX_NOTIFICATIONS))
      },
    })
  }

  useEffect(() => {
    fetchData()

    const interval = setInterval(fetchData, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  const handleMarkAllAsRead = async () => {
    await markAllAsRead({
      url: "/api/users/notifications/read-all",
      method: "PATCH",
      onSuccess: () => {
        setUnreadCount(0)

        setNotifications((current) =>
          current.map((notification) => ({
            ...notification,
            read_at: notification.read_at ?? new Date().toISOString(),
          }))
        )

        toast.success("All notifications marked as read")
      },
    })
  }

  const handleNotificationClick = (notification: Notification) => {
    setIsOpen(false)

    if (notification.action_url) {
      router.push(notification.action_url)
    } else {
      router.push(`/notifications/${notification.id}`)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            aria-label={`Notifications, ${unreadCount} unread`}
            variant="link"
            className="relative p-0 flex items-center justify-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          />
        }
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <Badge className="absolute -start-0 scale-80 -top-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)] p-0">
        <Card className="gap-0 border-0 pt-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <PopoverTitle>Notifications</PopoverTitle>

              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount}</Badge>
              )}
            </div>

            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllAsRead}
              >
                <CheckCheck className="size-4" />
                Mark all as read
              </Button>
            )}
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            {isLoadingNotifications && notifications.length === 0 ? (
              <div className="flex min-h-40 items-center justify-center">
                <Loader />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
                <Bell className="size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  You're all caught up.
                </p>
              </div>
            ) : (
              <ScrollShadow
                className="max-h-80"
                watch={notifications}
                icon={false}
              >
                <ul className="divide-y">
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <button
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
                      >
                        <span
                          className={`mt-1.5 size-2 shrink-0 rounded-full ${
                            notification.read_at
                              ? "bg-muted-foreground/30"
                              : "bg-primary"
                          }`}
                        />

                        <span className="min-w-0 flex-1 space-y-1">
                          <span className="block truncate text-sm font-medium">
                            {notification.title}
                          </span>

                          <span className="line-clamp-2 block text-xs text-muted-foreground">
                            {notification.message}
                          </span>

                          <span className="block text-xs text-muted-foreground">
                            {formatDate(notification.created_at)}
                          </span>
                        </span>

                        {notification.action_url && (
                          <ExternalLink className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollShadow>
            )}
          </CardContent>

          <CardFooter className="p-2">
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={() => {
                setIsOpen(false)
                router.push("/notifications")
              }}
            >
              View all notifications
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
