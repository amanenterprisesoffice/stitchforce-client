
"use client"

import { Plus, ShirtIcon } from "lucide-react"
import PageHeader from "@/components/ui/PageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Props {
  count: number
  onCreate: () => void
}

export default function StylesHeader({ count, onCreate }: Props) {
  return (
    <PageHeader
      title="Styles"
      description="Manage garment styles and their manufacturing operations."
      icon={<ShirtIcon className="size-5 text-muted-foreground" />}
      badge={<Badge variant="secondary">{count}</Badge>}
      action={
        <Button onClick={onCreate}>
          <Plus className="size-4" />
          Create Style
        </Button>
      }
    />
  )
}
