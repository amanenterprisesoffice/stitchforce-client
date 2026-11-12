"use client"

import type { ReactNode } from "react"
import {
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { formatDate } from "@/utils/utils"
import {
  ACTIVE_LICENSE,
  SUSPENDED_LICENSE,
  EXPIRED_LICENSE,
  getLicenseVariant,
  type Organization,
} from "@/utils/types/organization"

import { CopyButton } from "@/components/ui/CopyButton"
import { SUPPORT_EMAIL } from "@/constants/globals"

interface Props {
  organization: Organization
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: ReactNode
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex min-w-0 items-center gap-2 font-medium">
        {icon}
        <span className="break-all">{value || "—"}</span>
      </div>
    </div>
  )
}

export default function OrganizationDetails({ organization }: Props) {
  const router = useRouter()

  const isExpiredByDate =
    !!organization.license_expires_at &&
    new Date(organization.license_expires_at).getTime() <= Date.now()

  const hasValidLicense =
    organization.license_status === ACTIVE_LICENSE && !isExpiredByDate

  const licenseMessage =
    organization.license_status === SUSPENDED_LICENSE
      ? "Your organization's license has been suspended. Contact support to restore access."
      : organization.license_status === EXPIRED_LICENSE || isExpiredByDate
        ? "Your organization's license has expired. Renew your license to restore full access."
        : "Your organization's license is not active. Please check your license details."

  return (
    <div className="space-y-4">

      <Card className="w-full min-w-0">
        <CardHeader className="border-b">
          <CardTitle className="text-base">Organization information</CardTitle>
          <CardDescription>
            Details, address and license information for this organization
          </CardDescription>
        </CardHeader>

        <CardContent className="w-full min-w-0">
          <div className="grid w-full min-w-0 grid-cols-1 gap-x-4 gap-y-5 py-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="min-w-0 space-y-1">
              <p className="text-sm text-muted-foreground">Organization ID</p>
              <div className="flex items-center font-medium">
                <span className="font-mono text-xs break-all">
                  {organization.id}
                </span>
                <CopyButton label="" value={organization.id} />
              </div>
            </div>

            <Detail label="Organization name" value={organization.name} />

            <div className="min-w-0 space-y-1">
              <p className="text-sm text-muted-foreground">License status</p>
              <Badge
                variant={getLicenseVariant(organization.license_status)}
                className="capitalize"
              >
                <ShieldCheck className="mr-1 size-3" />
                {organization.license_status}
              </Badge>
            </div>

            <Detail
              label="License expires"
              value={
                organization.license_expires_at
                  ? formatDate(organization.license_expires_at)
                  : "No expiry date"
              }
              icon={<CalendarDays className="size-4 text-muted-foreground" />}
            />

            <Detail
              label="Address line 1"
              value={organization.address_line_1}
              icon={
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
              }
            />

            <Detail
              label="Address line 2"
              value={organization.address_line_2}
              icon={
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
              }
            />

            <Detail label="City" value={organization.city} />
            <Detail label="State" value={organization.state} />
            <Detail label="Postal code" value={organization.postal_code} />
            <Detail label="Country" value={organization.country} />

            <Detail
              label="Created at"
              value={formatDate(organization.created_at)}
              icon={<CalendarDays className="size-4 text-muted-foreground" />}
            />

            <Detail
              label="Last updated"
              value={formatDate(organization.updated_at)}
              icon={<Clock3 className="size-4 text-muted-foreground" />}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
