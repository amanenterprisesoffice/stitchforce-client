"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Bell } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import Loader from "@/components/ui/Loader"
import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"

import NotificationsHeader from "./components/header"
import NotificationsTable from "./components/table"
import NotificationDetails from "./components/details"

import {
  getNotifications,
  getUnreadCount,
  type Notification,
} from "@/utils/types/notifications"

const PAGE_SIZE = 10

export default function NotificationsPage() {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null)

  const {
    data,
    isLoading,
    error,
    refetch: fetchNotifications,
  } = useFetch<unknown>({ auto: false })

  const {
    data: unreadData,
    refetch: fetchUnreadCount,
  } = useFetch<unknown>({ auto: false })

  const { isLoading: isMarkingAllAsRead, refetch: markAllAsRead } =
    useFetch({ auto: false })

  const { refetch: markAsRead } = useFetch({ auto: false })

  const loadNotifications = useCallback(
    (limit = PAGE_SIZE, offset = 0) => {
      fetchNotifications({
        url: `/api/users/notifications?limit=${limit}&offset=${offset}`,
      })
      fetchUnreadCount({
        url: "/api/users/notifications/unread-count",
      })
    },
    [fetchNotifications, fetchUnreadCount]
  )

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const notifications: Notification[] = useMemo(
    () => getNotifications(data),
    [data]
  )

  const unreadCount = getUnreadCount(unreadData)

  const handleSelectNotification = async (notification: Notification) => {
    setSelectedNotification(notification)

    if (notification.read_at) return

    // Update the selected notification immediately.
    setSelectedNotification({
      ...notification,
      read_at: new Date().toISOString(),
    })

    await markAsRead({
      url: `/api/users/notifications/${notification.id}/read`,
      method: "PATCH",
      showErrorToast: true,
      onSuccess: () => {
        fetchUnreadCount({
          url: "/api/users/notifications/unread-count",
        })
        loadNotifications()
      },
    })
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead({
      url: "/api/users/notifications/read-all",
      method: "PATCH",
      onSuccess: () => {
        toast.success("All notifications marked as read")

        setSelectedNotification((current) =>
          current
            ? { ...current, read_at: new Date().toISOString() }
            : current
        )

        loadNotifications()
      },
    })
  }

  const handleNotificationDeleted = (id: string) => {
    setSelectedNotification((current) =>
      current?.id === id ? null : current
    )
    loadNotifications()
  }

  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col gap-5 p-4 md:p-6">
      <NotificationsHeader
        count={notifications.length}
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
        isMarkingAllAsRead={isMarkingAllAsRead}
      />

      <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative min-w-0">
          {isLoading && !data ? (
            <Loader text="Loading notifications" />
          ) : error ? (
            <StateComponent
              message={error}
              description="An error occurred while loading notifications."
              ICON={<Bell />}
              PortalButton={
                <Button variant="outline" onClick={() => loadNotifications()}>
                  Try again
                </Button>
              }
            />
          ) : notifications.length === 0 ? (
            <StateComponent
              message="No notifications"
              description="You have no notifications at this time."
              ICON={<Bell />}
            />
          ) : (
            <NotificationsTable
              notifications={notifications}
              selectedId={selectedNotification?.id}
              onSelect={handleSelectNotification}
              onPageChange={(offset) => loadNotifications(PAGE_SIZE, offset)}
              isLoading={isLoading}
            />
          )}
        </div>

        <NotificationDetails
          notification={selectedNotification}
          onDeleted={handleNotificationDeleted}
        />
      </div>
    </main>
  )
}