"use client"

import { useEffect, useMemo, useRef } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { State, City } from "country-state-city"
import { Building2 } from "lucide-react"

import type { Organization } from "@/utils/types/organization"
import { useUser } from "@/contexts/UserContext"

import FormField from "@/components/ui/FormField"
import FormSelect from "@/components/ui/FormSelect"
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

const organizationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(255),
  address_line_1: z.string().max(255),
  address_line_2: z.string().max(255),
  city: z.string().min(1, "Please select a city"),
  state: z.string().min(1, "Please select a state"),
  postal_code: z.string().max(20),
  country: z.string().min(1, "Country is required"),
  photo: z.array(z.instanceof(File)).max(1, "Only one photo is allowed"),
})

export type OrganizationFormValues = z.infer<typeof organizationSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  organization: Organization
  onSubmit: (formData: FormData) => Promise<void>
  isSaving: boolean
}

export default function EditOrganizationDialog({
  open,
  onOpenChange,
  organization,
  onSubmit,
  isSaving,
}: Props) {
  const { user } = useUser()

  const canUpdateOrganization =
    user?.role === "admin" || user?.role === "org_admin"

  const states = useMemo(() => State.getStatesOfCountry("IN"), [])

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      photo: [],
    },
  })

  const selectedState = watch("state")

  const cities = useMemo(() => {
    const state = states.find((item) => item.name === selectedState)

    if (!state) return []

    return City.getCitiesOfState("IN", state.isoCode)
  }, [selectedState, states])

  const previousState = useRef("")

  useEffect(() => {
    if (!open) return

    reset({
      name: organization.name,
      address_line_1: organization.address_line_1 || "",
      address_line_2: organization.address_line_2 || "",
      city: organization.city || "",
      state: organization.state || "",
      postal_code: organization.postal_code || "",
      country: organization.country || "India",
      photo: [],
    })

    previousState.current = organization.state || ""
  }, [open, organization, reset])

  useEffect(() => {
    if (
      previousState.current &&
      previousState.current !== selectedState
    ) {
      setValue("city", "", {
        shouldDirty: true,
        shouldValidate: true,
      })
    }

    previousState.current = selectedState
  }, [selectedState, setValue])

  const handleFormSubmit: SubmitHandler<OrganizationFormValues> = async (
    values
  ) => {
    if (!canUpdateOrganization) return

    const formData = new FormData()

    formData.append("name", values.name.trim())
    formData.append("address_line_1", values.address_line_1.trim())
    formData.append("address_line_2", values.address_line_2.trim())
    formData.append("city", values.city)
    formData.append("state", values.state)
    formData.append("postal_code", values.postal_code.trim())
    formData.append("country", values.country)

    if (values.photo?.[0]) {
      formData.append("photo", values.photo[0])
    }

    await onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>
            Update your organization's information and address.
          </DialogDescription>
        </DialogHeader>

        {!canUpdateOrganization ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Building2 className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Permission denied</p>
              <p className="text-sm text-muted-foreground">
                Only administrators can update organization details.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              id="name"
              label="Organization Name"
              placeholder="e.g. Aman Enterprises"
              register={register}
              errors={errors}
            />

            <FormField
              id="address_line_1"
              label="Address Line 1"
              placeholder="Building, street, area"
              register={register}
              errors={errors}
            />

            <FormField
              id="address_line_2"
              label="Address Line 2"
              placeholder="Landmark, locality (optional)"
              register={register}
              errors={errors}
            />

            <FormSelect
              id="state"
              label="State"
              control={control}
              errors={errors}
              disabled={isSaving}
              placeholder="Select state"
              options={states.map((state) => ({
                label: state.name,
                value: state.name,
              }))}
              searchBar
            />

            <FormSelect
              id="city"
              label="City"
              control={control}
              errors={errors}
              disabled={isSaving || !selectedState}
              placeholder="Select city"
              options={cities.map((city) => ({
                label: city.name,
                value: city.name,
              }))}
              searchBar
            />

            <FormField
              id="postal_code"
              label="Postal Code"
              placeholder="e.g. 421201"
              register={register}
              errors={errors}
            />

            <FormField
              id="country"
              label="Country"
              placeholder="Country"
              register={register}
              errors={errors}
            />

            <FileInput
              id="photo"
              label="Organization Photo"
              value={watch("photo") ?? []}
              onChange={(files) =>
                setValue("photo", files, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              disabled={isSaving}
              error={errors.photo?.message}
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
        )}
      </DialogContent>
    </Dialog>
  )
}