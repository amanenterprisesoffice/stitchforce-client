export const ORG_ADMIN = "org_admin" as const
export const ADMIN = "admin" as const
export const STAFF = "staff" as const

export type UserRole =
  | typeof ORG_ADMIN
  | typeof ADMIN
  | typeof STAFF

export interface User {
  id: string
  name: string
  email: string
  photo_url?: string
  organization_id: string
  role: UserRole
  email_verified_at: string | null
  created_at: string
  updated_at: string
}