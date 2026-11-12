"use client"

import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Organization } from "@/utils/types/organization"
import {
  ACTIVE_LICENSE,
  EXPIRED_LICENSE,
  SUSPENDED_LICENSE,
} from "@/utils/types/organization"

const SUPPORT_EMAIL = "support@stitchforce.com"

interface Props {
  organization: Organization
}

export default function LicenseWarning({ organization }: Props) {
  const router = useRouter()

  const isExpiredByDate =
    !!organization.license_expires_at &&
    new Date(organization.license_expires_at).getTime() <= Date.now()

  const hasValidLicense =
    organization.license_status === ACTIVE_LICENSE && !isExpiredByDate

  if (hasValidLicense) return null

  const licenseMessage =
    organization.license_status === SUSPENDED_LICENSE
      ? "Your organization's license has been suspended. Contact support to restore access."
      : organization.license_status === EXPIRED_LICENSE || isExpiredByDate
        ? "Your organization's license has expired. Activate your license to restore full access."
        : "Your organization's license is not active. Please contact support for assistance."

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />

        <div className="space-y-1">
          <p className="font-medium text-destructive">
            License{" "}
            {isExpiredByDate ? "expired" : organization.license_status}
          </p>

          <p className="text-sm text-muted-foreground">
            {licenseMessage}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => router.push("/organization/license")}
        >
          Activate License
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.location.href = `mailto:${SUPPORT_EMAIL}`
          }}
        >
          Contact Support
        </Button>
      </div>
    </div>
  )
}