"use client"

import { Wallet } from "lucide-react"
import PageHeader from "@/components/ui/PageHeader"

export default function AddNewWorkerPaymentHeader() {
  return (
    <PageHeader
      title="Create worker payment"
      icon={<Wallet className="size-5 text-muted-foreground" />}
      description="Review outstanding production earnings and record a payment for the selected worker and period."
    />
  )
}
