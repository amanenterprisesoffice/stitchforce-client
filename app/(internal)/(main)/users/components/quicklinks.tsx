"use client"

import { useRouter } from "next/navigation"
import { Users, ShieldCheck, CreditCard, FactoryIcon } from "lucide-react"

import { QuickLinks, QuickLinkItem } from "@/components/ui/quick-links"
import { SUPPORT_EMAIL } from "@/constants/globals"

export default function UserQuickLinks() {
  const router = useRouter()

  return (
    <QuickLinks className="h-fit!">
      <QuickLinkItem
        icon={<FactoryIcon className="size-5" />}
        title="View Organization"
        description="View organization details."
        onClick={() => router.push("/organization")}
      />
      <QuickLinkItem
        icon={<CreditCard className="size-5" />}
        title="Manage Workers"
        description="View and manage workers associated with the organization."
        onClick={() => router.push("/workers")}
      />
      <QuickLinkItem
        icon={<ShieldCheck className="size-5" />}
        title="Contact Support"
        description="Contact support for any issues or inquiries."
        onClick={() => (window.location.href = `mailto:${SUPPORT_EMAIL}`)}
      />
    </QuickLinks>
  )
}
