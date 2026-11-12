"use client"

import { useRouter } from "next/navigation"
import { Users, ShieldCheck, CreditCard } from "lucide-react"

import { QuickLinks, QuickLinkItem } from "@/components/ui/quick-links"
import { Organization } from "@/utils/types/organization"
import { SUPPORT_EMAIL } from "@/constants/globals"

export default function OrganizationQuickLinks({
  organization,
}: {
  organization: Organization
}) {
  const router = useRouter()

  return (
    <QuickLinks className="h-fit!">
      <QuickLinkItem
        icon={<Users className="size-5" />}
        title="Manage users"
        description="View organization members and pending invitations."
        onClick={() => router.push("/users")}
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
        description="Review the current organization license and expiry."
        onClick={() => (window.location.href = `mailto:${SUPPORT_EMAIL}`)}
      />
    </QuickLinks>
  )
}
