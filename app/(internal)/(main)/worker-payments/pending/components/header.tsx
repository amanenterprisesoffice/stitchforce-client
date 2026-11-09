"use client"

import { Plus, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"
import { useRouter } from "next/navigation"

interface Props {
  count: number
}

export default function PendingPayments({ count}: Props) {
  const router = useRouter()
  return (
    <PageHeader
      title="Pending Payments"
      icon={<Wallet />}
      badge={<Badge variant="secondary">{count}</Badge>}
      description="See which workers have pending payments."
      action={
        <Button onClick={() => router.push("/worker-payments/new")}>
          <Plus className="mr-2 size-4" />
          Record payment
        </Button>
      }
    />
  )
}
