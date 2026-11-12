"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Loader2,
  ShieldCheck,
  Building2,
  CalendarDays,
  Mail,
  MessageCircle,
  ArrowLeft,
  KeyRound,
  Info,
} from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useOrganization } from "@/contexts/OrganizationContext"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import FormField from "@/components/ui/FormField"

import { formatDate } from "@/utils/utils"
import {
  getLicenseVariant,
  type Organization,
} from "@/utils/types/organization"
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/constants/globals"
import { CopyButton } from "@/components/ui/CopyButton"
import { FaWhatsapp } from "react-icons/fa"
import Signature from "@/components/ui/signature"

export default function ActivateLicensePage() {
  const router = useRouter()
  const { organization, refetch } = useOrganization()

  const [licenseKey, setLicenseKey] = useState("")

  const { refetch: activateLicense, isLoading } = useFetch({
    auto: false,
    method: "POST",
    onSuccess: async () => {
      toast.success("License activated successfully.")
      await refetch()
      router.push("/dashboard")
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!organization?.id) {
      toast.error("Organization not found.")
      return
    }

    const key = licenseKey.trim()

    if (!key) {
      toast.error("Please enter your license key.")
      return
    }

    await activateLicense({
      url: `/api/organizations/${organization.id}/license/activate`,
      method: "POST",
      payload: {
        license_key: key,
      },
    })
  }

  const whatsappNumber = SUPPORT_PHONE.replace(/\D/g, "")

  const supportMessage = encodeURIComponent(
    `Hello, I need assistance with my StitchForce license.\n\nOrganization: ${organization?.name ?? ""}\nOrganization ID: ${organization?.id ?? ""}`
  )

  return (
    <div className="relative flex min-h-full items-center justify-center ">
      <main className="mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center gap-5 p-4 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <Card className="min-w-0">
            <CardHeader className="space-y-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="size-6 text-primary" />
              </div>

              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  Activate your license
                </CardTitle>

                <CardDescription>
                  Enter the license key issued to your organization to activate
                  or extend your subscription. If your organization already has
                  a license, entering a new license key may extend its validity
                  or update its license period, depending on the key. Contact
                  support if you need help with renewal or activation.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {organization && (
                <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="size-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {organization.name}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {organization.license_expires_at
                          ? `Expires ${formatDate(organization.license_expires_at)}`
                          : "No expiry date"}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={getLicenseVariant(organization.license_status)}
                    className="shrink-0 capitalize"
                  >
                    {organization.license_status}
                  </Badge>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="License key"
                  id="license-key"
                  placeholder="STF.XXXXXXXX.XXXXXXXX"
                  value={licenseKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLicenseKey(e.target.value)
                  }
                  disabled={isLoading}
                  autoComplete="off"
                  autoFocus
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !licenseKey.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <KeyRound className="mr-2 size-4" />
                  )}
                  Activate license
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base">Need assistance?</CardTitle>
              <CardDescription>
                Contact our team if you need a new license key, want to renew
                your subscription, or have trouble activating your license.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {organization && (
                <div className="rounded-md border bg-muted/30 p-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Organization ID
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="min-w-0 text-xs break-all">
                      {organization.id}
                    </code>
                    <CopyButton label="" value={organization.id} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Share this ID with our support team when requesting a
                    license.
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/organization")}
              >
                <Building2 className="mr-1 size-4" />
                View organization
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("StitchForce License Assistance")}&body=${supportMessage}`
                }}
              >
                <Mail className="mr-1 size-4" />
                Contact support
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={!whatsappNumber}
                onClick={() => {
                  window.open(
                    `https://wa.me/${whatsappNumber}?text=${supportMessage}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }}
              >
                <FaWhatsapp className="mr-1 size-4 text-[#25D366]" />
                WhatsApp support
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Signature />
    </div>
  )
}
