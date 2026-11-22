"use client"

import { useState } from "react"
import {
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react"

import DataTable from "@/components/ui/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { formatDate } from "@/utils/utils"
import type { Notification } from "@/utils/types/notifications"
import { formatNotificationType } from "@/utils/types/notifications"

const PAGE_SIZE = 10

interface Props {
  notifications: Notification[]
  selectedId?: string
  onSelect: (notification: Notification) => void
  onPageChange: (offset: number) => void
  isLoading: boolean
}

export default function NotificationsTable({
  notifications,
  selectedId,
  onSelect,
  onPageChange,
  isLoading,
}: Props & { isLoading: boolean }) {
  const [page, setPage] = useState(0)

  const columns = [
    {
      header: "Notification",
      render: (item: Notification) => (
        <div className="flex min-w-0 items-start gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{item.title}</p>
              {!item.read_at && <Badge>New</Badge>}
            </div>

            <p className="line-clamp-2 text-sm text-muted-foreground">
              {item.message}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      className: "hidden md:table-cell",
      render: (item: Notification) => (
        <Badge variant="secondary">
          {formatNotificationType(item.type)}
        </Badge>
      ),
    },
    {
      header: "Status",
      className: "whitespace-nowrap",
      render: (item: Notification) =>
        item.read_at ? (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4" />
            Read
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm font-medium">
            <Circle className="size-3 fill-current" />
            Unread
          </span>
        ),
    },
    {
      header: "Received",
      className: "whitespace-nowrap text-right",
      render: (item: Notification) => (
        <span className="text-sm">{formatDate(item.created_at)}</span>
      ),
    },
  ]

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    onPageChange(nextPage * PAGE_SIZE)
  }

  return (
    <div className="space-y-4">
      <DataTable
        data={notifications}
        columns={columns}
        getRowId={(item: Notification) => item.id}
        onRowClick={onSelect}
        emptyMessage="No notifications found."
        isLoading={isLoading}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page + 1}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={page === 0}
            onClick={() => handlePageChange(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={notifications.length < PAGE_SIZE}
            onClick={() => handlePageChange(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}