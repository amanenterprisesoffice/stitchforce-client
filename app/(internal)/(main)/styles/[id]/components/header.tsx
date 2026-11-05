import React from "react"
import PageHeader from "@/components/ui/PageHeader"
import { Shirt, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Style } from "@/utils/zodSchema/style"

const StyleHeader = ({
  style,
  openCreateDialog,
}: {
  style: Style | null
  openCreateDialog: () => void
}) => {
  if (!style) return null
  return (
    <PageHeader
      title={style.name}
      icon={<Shirt className="size-5 text-muted-foreground" />}
      badge={
        <>
          <Badge variant="outline" className="font-mono">
            {style.style_number}
          </Badge>
          <span className="text-xs text-muted-foreground">Style details</span>
        </>
      }
      action={
        <div className="flex gap-2">
          <Button onClick={openCreateDialog}>
            <Plus className="size-4" />
            Add Operation
          </Button>
        </div>
      }
      description={style.description}
    />
  )
}

export default StyleHeader
