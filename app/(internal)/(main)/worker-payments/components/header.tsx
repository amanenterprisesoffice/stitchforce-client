"use client"

import { Plus, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"
import { useRouter } from "next/navigation"

interface Props {
  count: number
}

export default function WorkerPaymentsHeader({ count}: Props) {
  const router = useRouter()
  return (
    <PageHeader
      title="Worker payments"
      icon={<Wallet />}
      badge={<Badge variant="secondary">{count}</Badge>}
      description="Track payments made to garment workers."
      action={
        <Button onClick={() => router.push("/worker-payments/new")}>
          <Plus className="mr-2 size-4" />
          Record payment
        </Button>
      }
    />
  )
}
