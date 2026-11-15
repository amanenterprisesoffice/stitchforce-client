"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, XCircle, Mail, ArrowLeft } from "lucide-react"
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

type RequestStatus = "idle" | "success" | "error"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
})

type FormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<RequestStatus>("idle")
  const [message, setMessage] = useState(
    "Enter your email address and we'll send you instructions to reset your password."
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const { refetch: requestPasswordReset, isLoading } = useFetch({
    auto: false,
    withAuth: false,
    showErrorToast: false,
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    requestPasswordReset({
      url: "/api/auth/forgot-password",
      method: "POST",
      payload: {
        email: values.email,
      },
      onSuccess: () => {
        setStatus("success")
        setMessage(
          "If an account exists with this email address, you will receive instructions to reset your password."
        )
        toast.success("Password reset instructions requested")
      },
      onError: (error: any) => {
        setStatus("error")
        setMessage(
          error?.message || "Unable to process your request. Please try again."
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
              <Mail className="size-8 text-muted-foreground" />
            )}
          </div>

          <CardTitle className="text-xl">
            {isLoading
              ? "Sending reset instructions"
              : status === "success"
                ? "Check your email"
                : status === "error"
                  ? "Request unsuccessful"
                  : status === "idle" && "Forgot your password?"}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-8 pt-2 pb-8">
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {message}
          </p>

          {status !== "success" && (
            <form
              id="forgot-password-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                id="email"
                label="Email"
                icon={<Mail size={15} />}
                placeholder="Enter your email"
                register={register}
                errors={errors}
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
              Back to login
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
                disabled={isLoading}
                className="flex-1"
                form="forgot-password-form"
              >
                {isLoading ? "Please wait..." : "Send reset instructions"}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <Signature />
    </div>
  )
}
