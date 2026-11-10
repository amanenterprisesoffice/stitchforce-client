"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useOrganization } from "@/contexts/OrganizationContext"
import FormField from "@/components/ui/FormField"

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

  console.log({organization})
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

  return (
    <main className="mx-auto flex h-full w-fit max-w-7xl min-w-[400px] flex-col justify-center gap-5 p-4 md:p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl">Activate your license</CardTitle>

            <CardDescription>
              Your organization needs an active license to access StitchForce.
              Enter the license key provided to you to continue.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <FormField
                label="License key"
                id="license-key"
                placeholder="STF.XXXXXXXX.XXXXXXXX"
                value={licenseKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLicenseKey(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !licenseKey.trim()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activate license
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
