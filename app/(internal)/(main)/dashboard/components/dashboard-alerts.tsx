"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Clock, CalendarDays, Mail, Pencil, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useUser } from "@/contexts/UserContext"
import { useOrganization } from "@/contexts/OrganizationContext"
import useFetch from "@/hooks/useFetch"

import FormField from "@/components/ui/FormField"
import FormSelect from "@/components/ui/FormSelect"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

const defaultValues: DashboardAlertsFormValues = {
  enabled: false,
  email: "",
  frequency: "daily",
  time: "09:00",
  day_of_week: "monday",
  day_of_month: "1",
}

const formatFrequency = (frequency?: string) => {
  if (!frequency) return "Daily"

  return frequency.charAt(0).toUpperCase() + frequency.slice(1)
}

const formatSchedule = (schedule: DashboardAlertsFormValues) => {
  switch (schedule.frequency) {
    case "weekly":
      return `Every ${
        schedule.day_of_week.charAt(0).toUpperCase() +
        schedule.day_of_week.slice(1)
      }`

    case "monthly":
      return `On day ${schedule.day_of_month} of each month`

    default:
      return "Every day"
  }
}

export default function DashboardAlerts() {
  const { user } = useUser()
  const { organization, setOrganization } = useOrganization()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const organizationID = user?.organization_id

  const { refetch: updateAlerts, isLoading: isSaving } = useFetch({
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
    defaultValues,
  })

  const enabled = watch("enabled")
  const frequency = watch("frequency")
  const dayOfWeek = watch("day_of_week")
  const dayOfMonth = watch("day_of_month")

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

  const currentSchedule: DashboardAlertsFormValues = {
    enabled: organization?.dashboard_alert_enabled ?? false,
    email: organization?.dashboard_alert_email ?? "",
    frequency: organization?.dashboard_alert_schedule?.frequency ?? "daily",
    time: organization?.dashboard_alert_schedule?.time ?? "09:00",
    day_of_week:
      organization?.dashboard_alert_schedule?.day_of_week ?? "monday",
    day_of_month: String(
      organization?.dashboard_alert_schedule?.day_of_month ?? 1
    ),
  }

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
        setIsDialogOpen(false)
        reset(values)

        setOrganization((prev) => {
          if (!prev) return prev

          return {
            ...prev,
            dashboard_alert_enabled: values.enabled,
            dashboard_alert_email: values.email,
            dashboard_alert_schedule: schedule,
          }
        })
      },
    })
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-base font-semibold">
              Dashboard Alerts
            </CardTitle>

            <CardDescription>
              Configure automatic dashboard reports sent to your email.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                currentSchedule.enabled
                  ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400"
                  : "border-border bg-muted/50 text-muted-foreground"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  currentSchedule.enabled
                    ? "bg-green-500"
                    : "bg-muted-foreground"
                }`}
              />
              {currentSchedule.enabled ? "Enabled" : "Disabled"}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="shrink-0"
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Mail className="size-4 text-muted-foreground" />
              </div>

              <div className="min-w-0 space-y-1">
                <p className="text-sm text-muted-foreground">Recipient email</p>

                <p className="text-sm font-medium break-all">
                  {currentSchedule.email || "Not configured"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <CalendarDays className="size-4 text-muted-foreground" />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Frequency</p>

                <p className="text-sm font-medium">
                  {formatFrequency(currentSchedule.frequency)}
                </p>

                <p className="text-xs text-muted-foreground">
                  {formatSchedule(currentSchedule)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Clock className="size-4 text-muted-foreground" />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Report time</p>

                <p className="text-sm font-medium">
                  {currentSchedule.time} (IST)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Dashboard alert settings</DialogTitle>

            <DialogDescription>
              Choose where and when your automated dashboard reports should be
              sent.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-start gap-3 rounded-lg border p-4">
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

              <FormSelect
                id="frequency"
                label="Report frequency"
                value={frequency}
                onChange={(value: string) =>
                  setValue(
                    "frequency",
                    value as DashboardAlertsFormValues["frequency"],
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    }
                  )
                }
                disabled={!enabled || isSaving}
                options={[
                  { label: "Daily", value: "daily" },
                  { label: "Weekly", value: "weekly" },
                  { label: "Monthly", value: "monthly" },
                ]}
              />

              {frequency === "weekly" && (
                <FormSelect
                  id="day_of_week"
                  label="Day of the week"
                  value={dayOfWeek}
                  onChange={(value: string) =>
                    setValue("day_of_week", value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  disabled={!enabled || isSaving}
                  options={weekdays}
                />
              )}

              {frequency === "monthly" && (
                <FormSelect
                  id="day_of_month"
                  label="Day of the month"
                  value={dayOfMonth}
                  onChange={(value: string) =>
                    setValue("day_of_month", value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  disabled={!enabled || isSaving}
                  options={daysOfMonth}
                />
              )}

              <FormField
                id="time"
                label="Report time"
                register={register}
                errors={errors}
                disabled={!enabled || isSaving}
                type="time"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset(currentSchedule)
                  setIsDialogOpen(false)
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSaving || !isDirty}>
                {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
                Save settings
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
