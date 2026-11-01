"use client"

import { useForm, SubmitHandler, FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useUser } from "@/contexts/UserContext"
import { baseSchema, signupSchema } from "@/utils/zodSchema/auth"
import { useState } from "react"
import useFetch from "@/hooks/useFetch"
import { Lock, MailIcon, User } from "lucide-react"
import FormField from "@/components/ui/FormField"

// Define a TypeScript interface for the form submission data
interface FormSubmit {
  email: string
  password: string
  name?: string
}

// Define the type for the AuthForm props
interface AuthFormProps {
  className?: string
  type: "signin" | "signup"
}

export function AuthForm({
  className,
  type = "signin",
  ...props
}: AuthFormProps) {
  const isSignup = type === "signup"
  const authUrl = isSignup ? "/api/auth/register" : "/api/auth/login"
  const formSchema = isSignup ? signupSchema : baseSchema
  const router = useRouter()
  const { setUser } = useUser()
  const { refetch, isLoading } = useFetch({
    url: authUrl,
    method: "POST",
    withAuth: false,
  })

  // Use React Hook Form with TypeScript
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  // Define the submit handler with the correct type
  const onSubmit: SubmitHandler<FormSubmit> = async (formValues) => {
    const payload: FormSubmit = {
      email: formValues.email,
      password: formValues.password,
    }

    if (isSignup) {
      payload.name = formValues.name
    }

    refetch({
      payload,
      onSuccess: (result: any) => {
        if (result?.user) {
          setUser(result.user)
          console.log("User logged in:", result)
          console.log("Before redirect")

          router.replace("/dashboard")
          router.refresh()

          console.log("After redirect")

          toast.success("Logged in successfully")
        } else {
          console.error("Unexpected response format:", result)
          toast.error("Something went wrong")
        }
      },
      onError: (error: any) => {
        toast.error(error?.message || "Something went wrong")
      },
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {isSignup ? "Create an account" : "Login to your account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSignup
            ? "Sign up with your email and password"
            : "Sign in to continue"}
        </p>
      </div>

      <div className="grid gap-4">
        {isSignup && (
          <FormField
            id="name"
            label="Name"
            icon={<User size={15} />}
            placeholder="Name"
            register={register}
            errors={errors}
          />
        )}

        <FormField
          id="email"
          label="Email"
          icon={<MailIcon size={15} />}
          placeholder="you@example.com"
          register={register}
          errors={errors}
        />

        <FormField
          id="password"
          label="Password"
          icon={<Lock size={15} />}
          placeholder="••••••••"
          register={register}
          errors={errors}
          isSecret
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Please wait..." : isSignup ? "Register" : "Login"}
        </Button>
      </div>

      <div className="text-center text-xs">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </>
        )}
      </div>
    </form>
  )
}
