"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"


import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import FormField from "@/components/ui/FormField"
import { deleteAccountSchema } from "@/utils/types/auth"
import Loader from "@/components/ui/Loader"

type DeleteAccountValues = z.infer<typeof deleteAccountSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail: string
  onConfirm: (values: DeleteAccountValues) => Promise<void>
  isDeleting: boolean
}

export default function DeleteUserDialog({
  open,
  onOpenChange,
  userEmail,
  onConfirm,
  isDeleting,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        password: "",
      })
    }
  }, [open, userEmail, reset])

  const handleClose = (nextOpen: boolean) => {
    if (isDeleting) return

    onOpenChange(nextOpen)

    if (!nextOpen) {
      reset({
        password: "",
      })
    }
  }

  const submit = async (values: DeleteAccountValues) => {
    await onConfirm(values)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Your Account?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete your account ({userEmail}). Enter
              your password to confirm this action. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <FormField
              id="password"
              label="Password"
              placeholder="Enter your password"
              register={register}
              errors={errors}
              disabled={isDeleting}
              autoComplete="current-password"
              type="password"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>

            <Button
              type="submit"
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting && (
                <Loader  />
              )}
              Delete account
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}