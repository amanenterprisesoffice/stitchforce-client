"use client"

import { PencilRuler, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/ui/PageHeader"

interface Props {
  count: number
  onCreate: () => void
}

export default function SizesHeader({ count, onCreate }: Props) {
  return (
    <PageHeader
      title="Sizes"
      description="Manage garment sizes and their manufacturing operations."
      icon={<PencilRuler className="size-5 text-muted-foreground" />}
      badge={<Badge variant="secondary">{count}</Badge>}
      action={
        <Button onClick={onCreate}>
          <Plus className="size-4" />
          Create Size
        </Button>
      }
    />
  )
}
