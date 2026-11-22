export type NotificationType = "license_expiry" | "report_ready" | "production" | "payment" | "security" | "system"

export interface Notification {
  id: string
  organization_id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown>
  action_url: string
  read_at?: string | null
  created_at: string
}

export function getNotifications(value: unknown): Notification[] {
  if (Array.isArray(value)) return value as Notification[]
  if (!value || typeof value !== "object") return []
  const obj = value as Record<string, unknown>
  if (Array.isArray(obj.notifications)) return obj.notifications as Notification[]
  if (Array.isArray(obj.data)) return obj.data as Notification[]
  if (obj.data && typeof obj.data === "object") {
    const nested = obj.data as Record<string, unknown>
    if (Array.isArray(nested.notifications)) return nested.notifications as Notification[]
  }
  return []
}

export function getUnreadCount(value: unknown): number {
  if (typeof value === "number") return value
  if (!value || typeof value !== "object") return 0
  const obj = value as Record<string, unknown>
  const nested = obj.data as Record<string, unknown> | undefined
  const count = obj.unread_count ?? obj.count ?? nested?.unread_count
  return typeof count === "number" ? count : 0
}

export function formatNotificationType(type: string) {
  return type.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")
}
