"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  CheckCircle2,
  XCircle,
  Lock,
  ArrowLeft,
} from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import Loader from "@/components/ui/Loader"
import FormField from "@/components/ui/FormField"
import Signature from "@/components/ui/signature"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ResetStatus = "idle" | "success" | "error"

const resetPasswordSchema = z.object({
  new_password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must not exceed 72 characters"),
  confirm_password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
}).refine((values) => values.new_password === values.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
})

type FormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<ResetStatus>("idle")
  const [message, setMessage] = useState(
    "Create a new password for your account."
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  })

  const { refetch: resetPassword, isLoading } = useFetch({
    auto: false,
    withAuth: false,
    showErrorToast: false,
  })

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("The password reset link is missing its token.")
    }
  }, [token])

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    if (!token) return

    resetPassword({
      url: "/api/auth/reset-password",
      method: "POST",
      payload: {
        token,
        new_password: values.new_password,
      },
      onSuccess: () => {
        setStatus("success")
        setMessage(
          "Your password has been reset successfully. You can now sign in using your new password."
        )
        toast.success("Password reset successfully")
      },
      onError: (error: any) => {
        setStatus("error")
        setMessage(
          error?.message ||
            "This password reset link is invalid or has expired. Please request a new one."
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
              <Lock className="size-8 text-muted-foreground" />
            )}
          </div>

          <CardTitle className="text-xl">
            {isLoading
              ? "Resetting your password"
              : status === "success"
                ? "Password reset successfully"
                : status === "error"
                  ? "Password reset unsuccessful"
                  : "Create a new password"}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-8 pt-2 pb-8">
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {message}
          </p>

          {status === "idle" && (
            <form
              id="reset-password-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                id="new_password"
                label="New password"
                icon={<Lock size={15} />}
                placeholder="Enter your new password"
                register={register}
                errors={errors}
                isSecret
              />

              <FormField
                id="confirm_password"
                label="Confirm password"
                icon={<Lock size={15} />}
                placeholder="Confirm your new password"
                register={register}
                errors={errors}
                isSecret
              />
            </form>
          )}
        </CardContent>

        <CardFooter className="gap-2">
          {status === "success" ? (
            <Button
              className="w-full"
              onClick={() => {
                window.location.href = "/login"
              }}
            >
              <ArrowLeft size={15} />
              Continue to login
            </Button>
          ) : status === "error" ? (
            <Button
              className="w-full"
              onClick={() => {
                window.location.href = "/forgot-password"
              }}
            >
              Request a new reset link
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  window.location.href = "/login"
                }}
              >
                <ArrowLeft size={15} />
                Back to login
              </Button>

              <Button
                type="submit"
                disabled={isLoading || !token}
                className="flex-1"
                form="reset-password-form"
              >
                {isLoading ? "Please wait..." : "Reset password"}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <Signature />
    </div>
  )
}