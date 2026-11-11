
"use client"

import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"


import FormField from "@/components/ui/FormField"
import FileInput from "@/components/ui/Fileinput"
import Loader from "@/components/ui/Loader"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User } from "@/utils/types/user"

interface UserFormValues {
  name: string
  email: string
  photo: File[]
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onSubmit: (formData: FormData) => Promise<void>
  isSaving: boolean
}

export default function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isSaving,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: {
      name: "",
      email: "",
      photo: [],
    },
  })

  useEffect(() => {
    if (!open) return

    reset({
      name: user.name,
      email: user.email,
      photo: [],
    })
  }, [open, user, reset])

  const handleFormSubmit: SubmitHandler<UserFormValues> = async (values) => {
    const formData = new FormData()

    formData.append("name", values.name.trim())
    formData.append("email", values.email.trim())

    if (values.photo?.[0]) {
      formData.append("photo", values.photo[0])
    }

    await onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>

          <DialogDescription>
            Update your account information and profile photo.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <FormField
            id="name"
            label="Full Name"
            placeholder="e.g. Aman Sharma"
            register={register}
            errors={errors}
          />

          <FormField
            id="email"
            label="Email Address"
            placeholder="e.g. aman@example.com"
            register={register}
            errors={errors}
          />

          <FileInput
            id="photo"
            label="Profile Photo"
            value={watch("photo") ?? []}
            onChange={(files) =>
              setValue("photo", files, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            disabled={isSaving}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
