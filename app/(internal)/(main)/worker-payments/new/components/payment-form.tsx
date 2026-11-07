"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import {
  CheckCircle2,
  CalendarDays,
  IndianRupee,
  Receipt,
  Wallet,
  Users2,
  MoreHorizontal,
} from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import FormSelect from "@/components/ui/FormSelect"
import FormField from "@/components/ui/FormField"
import FormDatePicker from "@/components/ui/FormDatePicker"
import StateComponent from "@/components/StateComponent"
import FormToggleGroup from "@/components/ui/FormToggleGroup"

import {
  getWorkerName,
  type GarmentWorker,
} from "@/utils/zodSchema/garmentWorker"

import {
  createWorkerPaymentSchema,
  type CreateWorkerPaymentValues,
  type WorkerPayment,
  type PaymentMethod,
  PayableProductionEntry,
} from "@/utils/zodSchema/payments"

import type { Bundle } from "@/utils/zodSchema/bundle"
import type { StyleOperation } from "@/utils/zodSchema/styleops"

import { formatMoney, getLocalDateValue } from "@/utils/utils"
import { WorkerFormInfo } from "../../../production-entries/new/components/form-info"
import PayableProductionEntriesTable from "./table"
import Loader from "@/components/ui/Loader"

// --------------------------------------------------
// TYPES
// --------------------------------------------------

interface WorkerPaymentSummary {
  total_earned: number
  total_paid: number
  total_pending: number
}

interface CreateWorkerPaymentPayload {
  worker_id: string
  from_date: string
  to_date: string
  payment_date: string
  payment_method: PaymentMethod
  reference?: string
  remarks?: string
}

interface PeriodPreset {
  label: string
  from_date: string
  to_date: string
}

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function toDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getPeriodPresets(): PeriodPreset[] {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  return [
    {
      label: "1st – 15th",
      from_date: toDateString(new Date(year, month, 1)),
      to_date: toDateString(new Date(year, month, 15)),
    },
    {
      label: "16th – Month end",
      from_date: toDateString(new Date(year, month, 16)),
      to_date: toDateString(new Date(year, month + 1, 0)),
    },
    {
      label: "Full month",
      from_date: toDateString(new Date(year, month, 1)),
      to_date: toDateString(new Date(year, month + 1, 0)),
    },
    {
      label: "Last 2 months",
      from_date: toDateString(new Date(year, month - 1, 1)),
      to_date: toDateString(new Date(year, month + 1, 0)),
    },
    {
      label: "Last 6 months",
      from_date: toDateString(new Date(year, month - 5, 1)),
      to_date: toDateString(new Date(year, month + 1, 0)),
    },
  ]
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number)

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function getShortID(id: string) {
  return id.length > 12 ? `${id.slice(0, 8)}...` : id
}

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

export default function WorkerPaymentForm() {
  const router = useRouter()
  const { user } = useUser()

  const orgID = user?.organization_id
  const base = orgID ? `/api/organizations/${orgID}` : ""

  // --------------------------------------------------
  // DATE PRESETS
  // --------------------------------------------------

  const presets = useMemo(() => getPeriodPresets(), [])

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const form = useForm<CreateWorkerPaymentValues>({
    resolver: zodResolver(createWorkerPaymentSchema),
    defaultValues: {
      worker_id: "",
      from_date: presets[0].from_date,
      to_date: presets[0].to_date,
      payment_date: getLocalDateValue(),
      payment_method: "cash",
      reference: "",
      remarks: "",
    },
  })

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = form

  // Subscribe to form values.
  const workerID = useWatch({
    control,
    name: "worker_id",
  })

  const fromDate = useWatch({
    control,
    name: "from_date",
  })

  const toDate = useWatch({
    control,
    name: "to_date",
  })

  const paymentDate = useWatch({
    control,
    name: "payment_date",
  })

  // --------------------------------------------------
  // SELECTED PRESET
  // --------------------------------------------------

  const selectedPreset = useMemo(() => {
    return (
      presets.find(
        (preset) => preset.from_date === fromDate && preset.to_date === toDate
      )?.label ?? ""
    )
  }, [presets, fromDate, toDate])

  const applyPreset = (label: string) => {
    const preset = presets.find((item) => item.label === label)

    if (!preset) return

    setValue("from_date", preset.from_date, {
      shouldValidate: true,
      shouldDirty: true,
    })

    setValue("to_date", preset.to_date, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  // --------------------------------------------------
  // WORKERS
  // --------------------------------------------------

  const { data: workers, isLoading: workersLoading } = useFetch<
    GarmentWorker[]
  >({
    auto: true,
    url: `${base}/garment-workers?status=active`,
  })

  const selectedWorker = useMemo(
    () => workers?.find((worker) => worker.id === workerID),
    [workers, workerID]
  )

  // --------------------------------------------------
  // WORKER PAYMENT SUMMARY
  // --------------------------------------------------

  const {
    data: summary,
    refetch: fetchSummary,
    isLoading: summaryLoading,
  } = useFetch<WorkerPaymentSummary>({
    auto: false,
  })

  useEffect(() => {
    if (!base || !workerID) return

    fetchSummary({
      url: `${base}/garment-workers/${workerID}/payment-summary`,
    })
  }, [base, workerID, fetchSummary])

  // --------------------------------------------------
  // PAYABLE PRODUCTION ENTRIES
  // --------------------------------------------------

  const {
    data: payableResponse,
    refetch: fetchPayableEntries,
    isLoading: entriesLoading,
  } = useFetch<PayableProductionEntry[]>({
    auto: false,
  })

  const validDateRange = !!fromDate && !!toDate && toDate >= fromDate

  useEffect(() => {
    if (!base || !workerID || !validDateRange) return

    fetchPayableEntries({
      url:
        `${base}/garment-workers/${workerID}/payable-entries` +
        `?from_date=${encodeURIComponent(fromDate)}` +
        `&to_date=${encodeURIComponent(toDate)}`,
    })
  }, [base, workerID, fromDate, toDate, validDateRange, fetchPayableEntries])

  const payableEntries = payableResponse ?? []

  const totalPayable = payableEntries.reduce(
    (total, entry) => total + entry.pending_amount,
    0
  )

  // --------------------------------------------------
  // CREATE PAYMENT
  // --------------------------------------------------

  const { refetch: createPayment, isLoading: saving } = useFetch<WorkerPayment>(
    {
      auto: false,
    }
  )

  const submit = async (values: CreateWorkerPaymentValues) => {
    if (!base || !payableEntries.length || saving) return

    const payload: CreateWorkerPaymentPayload = {
      worker_id: values.worker_id,
      from_date: values.from_date,
      to_date: values.to_date,
      payment_date: values.payment_date,
      payment_method: values.payment_method,
      reference: values.reference?.trim() || "",
      remarks: values.remarks?.trim() || "",
    }

    await createPayment({
      url: `${base}/worker-payments`,
      method: "POST",
      payload,

      onSuccess: (payment) => {
        toast.success("Worker payment created successfully")
        router.push(`/worker-payments/${payment.id}`)
      },

      onError: (error: any) => {
        toast.error(error?.message || "Failed to create worker payment")
      },
    })
  }

  // --------------------------------------------------
  // SUBMISSION STATE
  // --------------------------------------------------

  const canSubmit =
    !!workerID &&
    !!fromDate &&
    !!toDate &&
    !!paymentDate &&
    validDateRange &&
    payableEntries.length > 0 &&
    totalPayable > 0 &&
    !entriesLoading &&
    !summaryLoading &&
    !saving

  // --------------------------------------------------
  // ORGANIZATION STATE
  // --------------------------------------------------

  if (!orgID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Organization unavailable"
        description="Your organization information could not be loaded."
      />
    )
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="mx-auto h-full w-full min-w-0">
      <form onSubmit={handleSubmit(submit)} className="h-full w-full min-w-0">
        <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          {/* PAYMENT FORM */}

          <Card className="min-w-0 overflow-hidden shadow-sm">
            <CardHeader className="space-y-5 border-b">
              <FormSelect
                id="worker_id"
                label="Worker"
                placeholder={
                  workersLoading
                    ? "Loading workers..."
                    : "Select an active worker"
                }
                control={control}
                register={register}
                errors={errors}
                showLoader={workersLoading}
                options={workers?.map((worker) => ({
                  value: worker.id,
                  label: `${getWorkerName(worker)} · ${worker.phone || "No phone"}`,
                }))}
                searchBar
                disabled={saving}
              />

              {/* DATE RANGE */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormDatePicker
                  id="from_date"
                  label="From date"
                  control={control}
                  errors={errors}
                  disabled={saving}
                  placeholder="Select start date"
                  captionLayout="dropdown"
                />

                <FormDatePicker
                  id="to_date"
                  label="To date"
                  control={control}
                  errors={errors}
                  disabled={saving}
                  placeholder="Select end date"
                  captionLayout="dropdown"
                />
              </div>

              <FormToggleGroup
                name="payment_period"
                label="Quick select period"
                type="single"
                value={selectedPreset}
                onChange={(value) => {
                  if (typeof value === "string") {
                    applyPreset(value)
                  }
                }}
                options={presets.map((preset) => ({
                  value: preset.label,
                  label: preset.label,
                  icon: CalendarDays,
                }))}
                disabled={saving}
              />
            </CardHeader>

            <CardContent className="space-y-5">
              {/* PAYMENT DATE */}

              <FormDatePicker
                id="payment_date"
                label="Payment date"
                control={control}
                errors={errors}
                disabled={saving}
                placeholder="Select payment date"
                captionLayout="dropdown"
              />

              {/* PAYMENT METHOD */}

              <FormToggleGroup<CreateWorkerPaymentValues>
                name="payment_method"
                label="Payment method"
                control={control}
                errors={errors}
                type="single"
                defaultValue="cash"
                className="w-full"
                disabled={saving}
                options={[
                  {
                    value: "cash",
                    label: "Cash",
                    icon: Wallet,
                  },
                  {
                    value: "bank",
                    label: "Bank transfer",
                    icon: Receipt,
                  },
                  {
                    value: "upi",
                    label: "UPI",
                    icon: IndianRupee,
                  },
                  {
                    value: "cheque",
                    label: "Cheque",
                    icon: CheckCircle2,
                  },
                  {
                    value: "Other",
                    label: "Other",
                    icon: MoreHorizontal,
                  },
                ]}
              />

              {/* REFERENCE */}

              <FormField
                id="reference"
                label="Reference number (optional)"
                placeholder="Transaction ID, cheque number..."
                register={register}
                errors={errors}
              />

              {/* REMARKS */}

              <FormField
                id="remarks"
                label="Remarks (optional)"
                placeholder="Additional payment notes..."
                register={register}
                errors={errors}
                isTextArea
                rows={3}
              />
            </CardContent>

            {/* TOTAL AND SUBMIT */}

            <CardFooter className="flex flex-col items-stretch gap-4 border-t">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Payable entries</span>

                  <span className="font-semibold tabular-nums">
                    {entriesLoading ? "Loading..." : payableEntries.length}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Total payment</p>

                    <p className="text-xs text-muted-foreground">
                      All outstanding earnings in this period
                    </p>
                  </div>

                  <p className="text-2xl font-bold tabular-nums">
                    {formatMoney(totalPayable)}
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!canSubmit}>
                <CheckCircle2 className="mr-2 size-4" />

                {saving ? "Creating payment..." : "Create worker payment"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                All outstanding production earnings within the selected period
                will be automatically included.
              </p>
            </CardFooter>
          </Card>

          {/* WORKER INFORMATION AND PAYABLE ENTRIES */}

          <div className="flex min-w-0 flex-col gap-5">
            <WorkerFormInfo worker={selectedWorker} />

            {/* PAYABLE PRODUCTION ENTRIES */}

            <Card className="gap-0">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="size-4 text-muted-foreground" />

                    <h3 className="text-sm font-semibold">
                      Payable production entries
                    </h3>
                  </div>

                  <Badge variant="secondary">{payableEntries.length}</Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  Outstanding production earnings for the selected period.
                </p>
              </CardHeader>

              <CardContent className="p-0">
                {!workerID ? (
                  <StateComponent
                    className="rounded-none ring-0!"
                    ICON={<Users2 />}
                    message="Select a worker"
                    description="Select a worker to view payable production entries."
                  />
                ) : !validDateRange ? (
                  <StateComponent
                    className="rounded-none ring-0"
                    ICON={<Receipt />}
                    message="Select a valid date range"
                    description="Select a valid date range to view payable production entries."
                  />
                ) : entriesLoading ? (
                  <Loader />
                ) : payableEntries.length === 0 ? (
                  <StateComponent
                    ICON={<Receipt />}
                    className="rounded-none ring-0"
                    message="No payable entries"
                    description="No outstanding production earnings were found for this worker and period."
                  />
                ) : (
                  <PayableProductionEntriesTable entries={payableEntries} />
                )}
              </CardContent>

              {/* ENTRIES TOTAL */}
              {payableEntries.length > 0 &&
                !entriesLoading &&
                workerID &&
                validDateRange && (
                  <CardFooter className="flex flex-col gap-3">
                    {workerID && (
                      <>
                        <div className="flex w-full items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Total earned
                          </span>
                          <span className="text-sm font-medium tabular-nums">
                            {summaryLoading
                              ? "..."
                              : formatMoney(summary?.total_earned ?? 0)}
                          </span>
                        </div>

                        <div className="flex w-full items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Already paid
                          </span>
                          <span className="text-sm font-medium tabular-nums">
                            {summaryLoading
                              ? "..."
                              : formatMoney(summary?.total_paid ?? 0)}
                          </span>
                        </div>

                        <div className="flex w-full items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold">
                              Total Pending
                            </p>
                          </div>
                          <span className="text-lg font-bold tabular-nums">
                            {summaryLoading
                              ? "..."
                              : formatMoney(summary?.total_pending ?? 0)}
                          </span>
                        </div>
                      </>
                    )}
                  </CardFooter>
                )}
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
