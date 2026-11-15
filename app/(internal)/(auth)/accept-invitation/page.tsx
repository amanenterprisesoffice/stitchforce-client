
"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, XCircle, Lock, User } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import Loader from "@/components/ui/Loader"
import FormField from "@/components/ui/FormField"
import Signature from "@/components/ui/signature"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { z } from "zod"

type InvitationStatus = "idle" | "success" | "error"

const acceptInvitationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
})

type FormValues = z.infer<typeof acceptInvitationSchema>

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<InvitationStatus>("idle")
  const [message, setMessage] = useState("Enter your name and create a password to accept your invitation.")

  const submitted = useRef(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(acceptInvitationSchema),
  })

  const { refetch: acceptInvitation, isLoading } = useFetch({
    auto: false,
    withAuth: false,
    showErrorToast: false,
  })

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("The invitation link is missing its token.")
    }
  }, [token])

  const onSubmit: SubmitHandler<FormValues> = (formValues) => {
    if (!token || submitted.current) return

    submitted.current = true

    acceptInvitation({
      url: "/api/auth/accept-invitation",
      method: "POST",
      payload: {
        token,
        name: formValues.name,
        password: formValues.password,
      },
      onSuccess: () => {
        setStatus("success")
        setMessage(
          "Your invitation has been accepted successfully. You can now sign in to your account."
        )
        toast.success("Invitation accepted successfully")
      },
      onError: (error: any) => {
        submitted.current = false
        setStatus("error")
        setMessage(
          error?.message ||
            "This invitation link is invalid, expired, or has already been used."
        )
      },
    })
  }

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

            {status === "idle" && !isLoading && (
              <User className="size-8 text-muted-foreground" />
            )}
          </div>

          <CardTitle className="text-xl">
            {isLoading && "Accepting your invitation"}
            {status === "success" && "Invitation accepted successfully"}
            {status === "error" && "Invitation unsuccessful"}
            {status === "idle" && "Complete your account"}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-8 pt-2 pb-8">
          <CardDescription className="mb-6 text-center">
            {message}
          </CardDescription>

          {status === "idle" && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                id="name"
                label="Name"
                icon={<User size={15} />}
                placeholder="Enter your name"
                register={register}
                errors={errors}
              />

              <FormField
                id="password"
                label="Password"
                icon={<Lock size={15} />}
                placeholder="Create a password"
                register={register}
                errors={errors}
                isSecret
              />

              <Button
                type="submit"
                disabled={isLoading || !token}
                className="w-full"
              >
                {isLoading ? "Please wait..." : "Accept Invitation"}
              </Button>
            </form>
          )}
        </CardContent>

        {(status === "success" || status === "error") && (
          <CardFooter className="border-t px-8 py-5">
            <Button
              onClick={() => {
                window.location.href = "/login"
              }}
              className="w-full"
            >
              {status === "success" ? "Continue to login" : "Back to login"}
            </Button>
          </CardFooter>
        )}
      </Card>

      <Signature />
    </div>
  )
}
