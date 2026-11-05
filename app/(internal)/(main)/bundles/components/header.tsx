
"use client"

import { Package, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/ui/PageHeader"

interface Props {
  count: number
  onCreate: () => void
}

export default function BundlesHeader({ count, onCreate }: Props) {
  return (
    <PageHeader
      title="Bundles"
      description="Manage garment bundles, quantities, and manufacturing details."
      icon={<Package className="size-5 text-muted-foreground" />}
      badge={<Badge variant="secondary">{count}</Badge>}
      action={
        <Button onClick={onCreate}>
          <Plus className="size-4" />
          Create Bundle
        </Button>
      }
    />
  )
}
