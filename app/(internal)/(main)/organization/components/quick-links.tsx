"use client"

import { useRouter } from "next/navigation"
import { Users, ShieldCheck, CreditCard } from "lucide-react"

import { QuickLinks, QuickLinkItem } from "@/components/ui/quick-links"
import { hasValidLicense, Organization } from "@/utils/types/organization"
import { SUPPORT_EMAIL } from "@/constants/globals"

export default function OrganizationQuickLinks({
  organization,
}: {
  organization: Organization
}) {
  const router = useRouter()
  const isValidLicense = hasValidLicense(organization)

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
      {isValidLicense && (
        <QuickLinkItem
          icon={<ShieldCheck className="size-5" />}
          title="Extend License"
          description="Extend your organization license."
          onClick={() => router.push("/organization/license")}
        />
      )}
      <QuickLinkItem
        icon={<ShieldCheck className="size-5" />}
        title="Contact Support"
        description="Contact support for any issues or inquiries."
        onClick={() => (window.location.href = `mailto:${SUPPORT_EMAIL}`)}
      />
    </QuickLinks>
  )
}
