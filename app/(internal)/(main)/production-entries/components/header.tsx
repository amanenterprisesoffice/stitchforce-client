"use client"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/ui/PageHeader"
export default function ProductionEntriesHeader({ count }: { count: number }) {
  return (
    <PageHeader
      title="Production entries"
      badge={<Badge variant="secondary">{count}</Badge>}
      description="Record worker output, track bundle progress, and review piece-rate earnings."
    />
  )
}
