"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import PageHeader from "@/components/ui/PageHeader"
import { Plus } from "lucide-react"

export default function ProductionEntriesHeader({ count }: { count: number }) {
  return (
    <PageHeader
      title="Production entries"
      badge={<Badge variant="secondary">{count}</Badge>}
      description="Record worker output, track bundle progress, and review piece-rate earnings."
      action={
        <Button render={<Link href="/production-entries/new" />}>
          <Plus className="size-4" />
          Add production entries
        </Button>
      }
    />
  )
}
