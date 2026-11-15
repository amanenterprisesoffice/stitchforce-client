import type { UserRole } from "@/utils/types/user"

export interface OrganizationInvitation {
  id: string
  organization_id: string
  email: string
  role: UserRole
  expires_at: string
  accepted_at: string | null
  created_at: string
}

export interface OrganizationInvitationsResponse {
  invitations: OrganizationInvitation[]
  message: string
  success: boolean
}

export interface Organization {
  id: string
  name: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  postal_code: string
  country: string
  photo_url?: string | null
  license_status: LicenseStatus
  license_expires_at: string | null
  created_at: string
  updated_at: string

  dashboard_alert_enabled: boolean
  dashboard_alert_email: string
  dashboard_alert_schedule: {
    frequency: "daily" | "weekly" | "monthly"
    time: string
    day_of_week?: string
    day_of_month?: number
  }
  dashboard_alert_last_sent_at : string | null
}

export const ACTIVE_LICENSE = "active" as const
export const SUSPENDED_LICENSE = "suspended" as const
export const EXPIRED_LICENSE = "expired" as const

export const LICENSE_STATUSES = [
  ACTIVE_LICENSE,
  SUSPENDED_LICENSE,
  EXPIRED_LICENSE,
] as const

export type LicenseStatus = (typeof LICENSE_STATUSES)[number]

export function hasValidLicense(organization: Organization | null): boolean {
  return (
    organization?.license_status === ACTIVE_LICENSE &&
    (!organization.license_expires_at ||
      new Date(organization.license_expires_at).getTime() > Date.now())
  )
}

function getLicenseVariant(status: Organization["license_status"]) {
  switch (status) {
    case ACTIVE_LICENSE:
      return "default"
    case SUSPENDED_LICENSE:
      return "destructive"
    case EXPIRED_LICENSE:
      return "outline"
    default:
      return "secondary"
  }
}
export { getLicenseVariant }
