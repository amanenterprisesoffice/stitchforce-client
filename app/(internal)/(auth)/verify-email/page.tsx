"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, XCircle } from "lucide-react"

import useFetch from "@/hooks/useFetch"
import Loader from "@/components/ui/Loader"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type VerificationStatus = "loading" | "success" | "error"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<VerificationStatus>("loading")

  const { refetch, isLoading, error } = useFetch({
    url: "/api/auth/verify-email",
    method: "POST",
    withAuth: false,
    showErrorToast: false,
    onSuccess: () => setStatus("success"),
    onError: () => setStatus("error"),
  })

  useEffect(() => {
    if (!token) {
      setStatus("error")
      return
    }

    refetch({ payload: { token } })
  }, [token, refetch])

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md gap-0">
        <CardHeader className="flex flex-col items-center px-8 pt-8 text-center">
          <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-muted">
            {isLoading && <Loader />}

            {status === "success" && (
              <CheckCircle2 className="size-8 text-green-600" />
            )}

            {status === "error" && (
              <XCircle className="size-8 text-destructive" />
            )}
          </div>

          <CardTitle className="text-xl">
            {isLoading && "Verifying your email"}
            {status === "success" && "Email verified successfully"}
            {status === "error" && "Verification unsuccessful"}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-8 pt-2 pb-8 text-center">
          <CardDescription>
            {isLoading && "Please wait while we verify your email address."}

            {status === "success" &&
              "Your email address has been verified successfully. You can now sign in to your account."}

            {status === "error" &&
              (!token
                ? "Verification token is missing from the link."
                : "This verification link is invalid, expired, or has already been used.")}
          </CardDescription>
        </CardContent>

        {!isLoading && (
          <CardFooter className="border-t px-8 py-5">
            <Button
              render={
                <Link href="/login">
                  {status === "success" ? "Continue to login" : "Back to login"}
                </Link>
              }
              className="w-full"
            />
          </CardFooter>
        )}
      </Card>
      <p className="absolute bottom-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} StitchForce. All rights reserved.
      </p>
    </div>
  )
}
