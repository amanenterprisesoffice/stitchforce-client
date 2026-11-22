export interface Report {
  id: string
  organization_id: string
  type: "monthly_archive"
  year: number
  month: number
  file_size: number
  record_counts: Record<string, number>
  archived_at: string
  expires_at: string
  created_at: string
}