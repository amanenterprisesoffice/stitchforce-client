"use client"

import { Plus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/ui/PageHeader"

interface Props {
  count: number
  onInvite: () => void
}

export default function UsersHeader({ count, onInvite }: Props) {
  return (
    <PageHeader
      title="Users"
      description=""
      icon={<Users className="size-5 text-muted-foreground" />}
      badge={<Badge variant="secondary">{count}</Badge>}
      action={
        <Button onClick={onInvite}>
          <Plus className="size-4" />
          Add User
        </Button>
      }
    />
  )
}
