"use client"

import { useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Bell, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useUser } from "@/contexts/UserContext"
import { useOrganization } from "@/contexts/OrganizationContext"

import FormField from "@/components/ui/FormField"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import useFetch from "@/hooks/useFetch"

const dashboardAlertsSchema = z
  .object({
    enabled: z.boolean(),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .or(z.literal("")),
    frequency: z.enum(["daily", "weekly", "monthly"]),
    time: z.string().min(1, "Time is required"),
    day_of_week: z.string(),
    day_of_month: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.enabled && !values.email) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Email is required when alerts are enabled",
      })
    }

    if (values.frequency === "weekly" && !values.day_of_week) {
      ctx.addIssue({
        code: "custom",
        path: ["day_of_week"],
        message: "Select a day of the week",
      })
    }

    if (values.frequency === "monthly") {
      const day = Number(values.day_of_month)

      if (!Number.isInteger(day) || day < 1 || day > 31) {
        ctx.addIssue({
          code: "custom",
          path: ["day_of_month"],
          message: "Select a valid day",
        })
      }
    }
  })

type DashboardAlertsFormValues = z.infer<typeof dashboardAlertsSchema>

const weekdays = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
]

const daysOfMonth = Array.from({ length: 31 }, (_, index) => ({
  label: String(index + 1),
  value: String(index + 1),
}))

export default function DashboardAlerts() {
  const { user } = useUser()
  const { organization } = useOrganization()

  const organizationID = user?.organization_id

  const {
    refetch: updateAlerts,
    isLoading: isSaving,
  } = useFetch({
    auto: false,
    withAuth: true,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<DashboardAlertsFormValues>({
    resolver: zodResolver(dashboardAlertsSchema),
    defaultValues: {
      enabled: false,
      email: "",
      frequency: "daily",
      time: "09:00",
      day_of_week: "monday",
      day_of_month: "1",
    },
  })

  const enabled = watch("enabled")
  const frequency = watch("frequency")

  useEffect(() => {
    if (!organization) return

    const schedule = organization.dashboard_alert_schedule

    reset({
      enabled: organization.dashboard_alert_enabled ?? false,
      email: organization.dashboard_alert_email ?? "",
      frequency: schedule?.frequency ?? "daily",
      time: schedule?.time ?? "09:00",
      day_of_week: schedule?.day_of_week ?? "monday",
      day_of_month: String(schedule?.day_of_month ?? 1),
    })
  }, [organization, reset])

  const onSubmit = async (values: DashboardAlertsFormValues) => {
    if (!organizationID) return

    const schedule = {
      frequency: values.frequency,
      time: values.time,
      timezone: "Asia/Kolkata",
      ...(values.frequency === "weekly" && {
        day_of_week: values.day_of_week,
      }),
      ...(values.frequency === "monthly" && {
        day_of_month: Number(values.day_of_month),
      }),
    }

    await updateAlerts({
      url: `/api/organizations/${organizationID}`,
      method: "PUT",
      payload: {
        dashboard_alert_enabled: values.enabled,
        dashboard_alert_email: values.email,
        dashboard_alert_schedule: schedule,
      },
      onSuccess: () => {
        toast.success("Dashboard alert settings updated")
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="size-5" />
          Dashboard Alerts
        </CardTitle>
        <CardDescription>
          Configure automatic dashboard reports and choose when they should
          be sent to your email.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="dashboard-alert-enabled"
              checked={enabled}
              onCheckedChange={(checked) =>
                setValue("enabled", checked === true, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              disabled={isSaving}
            />

            <div className="space-y-1">
              <Label htmlFor="dashboard-alert-enabled">
                Enable dashboard alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive automated reports according to your selected schedule.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <FormField
              id="email"
              label="Email address"
              placeholder="reports@example.com"
              register={register}
              errors={errors}
              disabled={!enabled || isSaving}
              autoComplete="email"
            />

            <div className="space-y-2">
              <Label htmlFor="frequency">Report frequency</Label>
              <select
                id="frequency"
                {...register("frequency")}
                disabled={isSaving}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              {errors.frequency && (
                <p className="text-sm text-destructive">
                  {errors.frequency.message}
                </p>
              )}
            </div>

            {frequency === "weekly" && (
              <div className="space-y-2">
                <Label htmlFor="day_of_week">Day of the week</Label>
                <select
                  id="day_of_week"
                  {...register("day_of_week")}
                  disabled={isSaving}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {weekdays.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
                {errors.day_of_week && (
                  <p className="text-sm text-destructive">
                    {errors.day_of_week.message}
                  </p>
                )}
              </div>
            )}

            {frequency === "monthly" && (
              <div className="space-y-2">
                <Label htmlFor="day_of_month">Day of the month</Label>
                <select
                  id="day_of_month"
                  {...register("day_of_month")}
                  disabled={isSaving}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {daysOfMonth.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
                {errors.day_of_month && (
                  <p className="text-sm text-destructive">
                    {errors.day_of_month.message}
                  </p>
                )}
              </div>
            )}

            <FormField
              id="time"
              label="Report time"
              register={register}
              errors={errors}
              disabled={isSaving}
              type="time"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving || !isDirty}>
              {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}