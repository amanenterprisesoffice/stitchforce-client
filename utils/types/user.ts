// Define a type for the user object
export type UserRole = "org_admin" | "admin" | "staff"

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
