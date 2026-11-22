"use client"

import type { Notification } from "@/utils/types/notifications"
import DataTable from "@/components/ui/DataTable"
import { prettifyKey, IsUUID } from "@/utils/utils"
import { CopyButton } from "@/components/ui/CopyButton"

export default function NotificationDetailsTable({
  notification,
}: {
  notification: Notification
}) {
  const columns = [
    {
      header: "Key",
      render: (item: { key: string; value: unknown }) => (
        <span className="font-medium">{prettifyKey(item.key)}</span>
      ),
    },
    {
      header: "Value",
      render: (item: { key: string; value: unknown }) => {
        // check is isuuid, render CopyButton component
        if (typeof item.value === "string" && IsUUID(item.value)) {
          return <CopyButton   label={`${item.value?.slice(0, 5) ?? ""}..`} value={item.value} />
        }
        return (
          <div className="truncate wrap-break-word text-muted-foreground">
            {item.value == null
              ? "—"
              : typeof item.value === "object"
                ? JSON.stringify(item.value)
                : String(item.value)}
          </div>
        )
      },
    },
  ]

  const entries = Object.entries(notification.data ?? {}).map(
    ([key, value]) => ({ key, value })
  )

  return (
    <DataTable
      data={entries}
      columns={columns}
      getRowId={(item) => item.key}
      emptyMessage="No additional data."
      isLoading={false}
    />
  )
}
