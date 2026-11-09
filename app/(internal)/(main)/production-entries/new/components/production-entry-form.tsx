"use client"

import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CheckCircle2, UserRound } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

import FormSelect from "@/components/ui/FormSelect"
import FormField from "@/components/ui/FormField"
import FormDatePicker from "@/components/ui/FormDatePicker"
import StateComponent from "@/components/StateComponent"

import { getWorkerName } from "@/utils/zodSchema/garmentWorker"

import {
  productionEntrySchema,
  type ProductionEntryFormValues,
  type ProductionEntryPayload,
} from "@/utils/zodSchema/production-entry"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import type { Bundle } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { StyleOperation } from "@/utils/zodSchema/styleops"

import { formatMoney, getLocalDateValue } from "@/utils/utils"

import {
  BundleFormInfo,
  OperationFormInfo,
  StyleFormInfo,
  WorkerFormInfo,
} from "./form-info"



export default function NewProductionEntriesPage() {
  const { user } = useUser()

  const orgID = user?.organization_id
  const base = orgID ? `/api/organizations/${orgID}` : ""

  const form = useForm<ProductionEntryFormValues>({
    resolver: zodResolver(productionEntrySchema),
    defaultValues: {
      style_id: "",
      bundle_id: "",
      style_operation_id: "",
      worker_id: "",
      production_date: getLocalDateValue(),
      remarks: "",
    },
  })

  const {
    watch,
    setValue,
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form

  const styleID = watch("style_id")
  const bundleID = watch("bundle_id")
  const operationID = watch("style_operation_id")
  const workerID = watch("worker_id")

  // Styles
  const { data: styles, isLoading: stylesLoading } = useFetch<Style[]>({
    auto: true,
    url: `${base}/styles`,
  })

  // Workers
  const { data: workers, isLoading: workersLoading } = useFetch<
    GarmentWorker[]
  >({
    auto: true,
    url: `${base}/garment-workers?status=active`,
  })

  // Bundles
  const {
    data: bundles,
    refetch: fetchBundles,
    isLoading: bundlesLoading,
  } = useFetch<Bundle[]>({
    auto: false,
  })

  // Operations
  const {
    data: operations,
    refetch: fetchOperations,
    isLoading: operationsLoading,
  } = useFetch<StyleOperation[]>({
    auto: false,
  })

  // Create entry
  const { refetch: createEntry, isLoading: saving } = useFetch({
    auto: false,
  })

  // Selected records
  const selectedStyle = useMemo(
    () => styles?.find((item) => item.id === styleID),
    [styles, styleID]
  )

  const selectedBundle = useMemo(
    () => bundles?.find((item) => item.id === bundleID),
    [bundles, bundleID]
  )

  const selectedOperation = useMemo(
    () => operations?.find((item) => item.id === operationID),
    [operations, operationID]
  )

  const selectedWorker = useMemo(
    () => workers?.find((item) => item.id === workerID),
    [workers, workerID]
  )

  // Initial query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const initialStyleID = params.get("style_id")
    const initialBundleID = params.get("bundle_id")

    if (initialStyleID) {
      setValue("style_id", initialStyleID)
    }

    if (initialBundleID) {
      setValue("bundle_id", initialBundleID)
    }
  }, [setValue])

  // Load bundles and operations
  useEffect(() => {
    if (!base || !styleID) return

    fetchBundles({
      url: `${base}/bundles?style_id=${encodeURIComponent(styleID)}`,

      onSuccess: (result) => {
        if (!result.some((item) => item.id === bundleID)) {
          setValue("bundle_id", "")
        }
      },
    })

    fetchOperations({
      url: `${base}/styles/${encodeURIComponent(styleID)}/operations`,

      onSuccess: () => {
        setValue("style_operation_id", "")
      },
    })
  }, [styleID, orgID])

  // Submit
  const submit = async (values: ProductionEntryFormValues) => {
    if (!base || !selectedBundle || !selectedOperation) {
      toast.error("Please select a style, bundle, and operation")
      return
    }

    const payload: ProductionEntryPayload = {
      bundle_id: values.bundle_id,
      worker_id: values.worker_id,
      style_operation_id: values.style_operation_id,
      production_date: new Date(values.production_date).toISOString(),
      remarks: values.remarks.trim(),
    }

    await createEntry({
      url: `${base}/production-entries`,
      method: "POST",
      payload,

      onSuccess: () => {
        toast.success("Production entry added")

        reset({
          style_id: values.style_id,
          bundle_id: "",
          style_operation_id: "",
          worker_id: "",
          production_date: getLocalDateValue(),
          remarks: "",
        })
      },

    })
  }

  if (!orgID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Organization unavailable"
        description="Your organization information could not be loaded."
      />
    )
  }

  const earnings =
    selectedOperation && selectedBundle
      ? selectedOperation.rate_per_piece * selectedBundle.quantity
      : null

  const canSubmit =
    !!styleID &&
    !!bundleID &&
    !!operationID &&
    !!workerID &&
    !!watch("production_date") &&
    !saving &&
    !operationsLoading &&
    !bundlesLoading

  return (
    <div className="mx-auto h-fit w-full min-w-0">
      <form onSubmit={handleSubmit(submit)} className="h-full w-full min-w-0">
        <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.8fr)] 2xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          {/* WORKER PRODUCTION */}
          <Card className="min-w-0 overflow-hidden shadow-sm">
            <CardHeader className="grid min-w-0 grid-cols-1 gap-3 border-b sm:grid-cols-2">
              <FormSelect
                id="style_id"
                label="Style"
                placeholder={
                  stylesLoading ? "Loading styles..." : "Select a style"
                }
                control={control}
                register={register}
                options={styles?.map((style) => ({
                  value: style.id,
                  label: style.style_number
                    ? `${style.style_number} - ${style.name}`
                    : style.name,
                }))}
                errors={errors}
                showLoader={stylesLoading}
                searchBar
              />

              <FormSelect
                id="bundle_id"
                label={`Bundle${bundles?.length ? ` (${bundles.length})` : ""}`}
                placeholder={
                  !styleID
                    ? "Select a style first"
                    : bundlesLoading
                      ? "Loading bundles..."
                      : "Select a bundle"
                }
                control={control}
                register={register}
                errors={errors}
                options={bundles?.map((bundle) => ({
                  value: bundle.id,
                  label: `${bundle.bundle_number} · ${bundle.quantity} pcs`,
                }))}
                searchBar
                disabled={!styleID || bundlesLoading}
              />

              <FormSelect
                id="style_operation_id"
                label={`Operation${operations?.length ? ` (${operations.length})` : ""}`}
                placeholder={
                  !styleID
                    ? "Select a style first"
                    : operationsLoading
                      ? "Loading operations..."
                      : "Select an operation"
                }
                control={control}
                register={register}
                options={operations?.map((operation) => ({
                  value: operation.id,
                  label: operation.name,
                }))}
                errors={errors}
                showLoader={operationsLoading}
                searchBar
                disabled={!styleID || operationsLoading}
              />

              <FormDatePicker
                id="production_date"
                label="Production date"
                control={control}
                errors={errors}
                disabled={saving}
                placeholder="Select production date"
                captionLayout="dropdown"
              />
            </CardHeader>

            <CardContent className="min-w-0 space-y-4">
              {/* Production inputs */}

              {/* Worker selection */}
              <div className="">
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
                    label: getWorkerName(worker),
                  }))}
                  searchBar
                />
              </div>

              {/* Remarks */}
              <FormField
                id="remarks"
                label="Remarks (optional)"
                placeholder="Work completed, notes..."
                register={register}
                errors={errors}
                isTextArea
                rows={3}
              />
            </CardContent>

            <CardFooter className="flex flex-col items-stretch gap-4">
              <div className="w-full min-w-0 space-y-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Production quantity
                  </span>

                  <span className="shrink-0 font-semibold tabular-nums">
                    {selectedBundle
                      ? `${Number(selectedBundle.quantity).toLocaleString(
                          "en-IN"
                        )} pcs`
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Rate per piece</span>

                  <span className="shrink-0 font-semibold tabular-nums">
                    {selectedOperation
                      ? formatMoney(selectedOperation.rate_per_piece)
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Estimated earnings</p>

                    <p className="text-xs text-muted-foreground">
                      Quantity × operation rate
                    </p>
                  </div>

                  <p className="shrink-0 text-xl font-bold tabular-nums">
                    {earnings !== null ? formatMoney(earnings) : "—"}
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!canSubmit}>
                <CheckCircle2 className="mr-2 size-4" />
                {saving ? "Saving entry..." : "Add production entry"}
              </Button>
            </CardFooter>
          </Card>

          {/* PRODUCTION INFORMATION */}
          <div className="flex min-w-0 flex-col gap-5">
            <WorkerFormInfo worker={selectedWorker} />
            <StyleFormInfo style={selectedStyle} />
            <BundleFormInfo bundle={selectedBundle} />
            <OperationFormInfo operation={selectedOperation} />
          </div>
        </div>
      </form>
    </div>
  )
}
