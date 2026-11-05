"use client"

import { Plus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/ui/PageHeader"

interface Props {
  count: number
  onCreate: () => void
}

export default function WorkersHeader({ count, onCreate }: Props) {
  return (
    <PageHeader
      title="Garment Workers"
      description="Manage your workers and their employment status."
      icon={<Users className="size-5 text-muted-foreground" />}
      badge={<Badge variant="secondary">{count}</Badge>}
      action={
        <Button onClick={onCreate}>
          <Plus className="size-4" />
          Add Worker
        </Button>
      }
    />
  )
}
