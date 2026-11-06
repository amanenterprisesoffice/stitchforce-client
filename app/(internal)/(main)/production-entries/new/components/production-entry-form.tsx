"use client"

import { use, useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CheckCircle2, Scissors } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import FormSelect from "@/components/ui/FormSelect"
import FormField from "@/components/ui/FormField"
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

import { formatMoney, unwrapList } from "@/utils/utils"

import {
  BundleFormInfo,
  OperationFormInfo,
  StyleFormInfo,
  WorkerFormInfo,
} from "./form-info"
import { useRouter } from "next/navigation"

function getLocalDateTime() {
  const now = new Date()
  const offset = now.getTimezoneOffset()

  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 16)
}

export default function NewProductionEntriesPage() {
  const { user } = useUser()
  const router = useRouter()
  const orgID = user?.organization_id
  const base = orgID ? `/api/organizations/${orgID}` : ""

  const form = useForm<ProductionEntryFormValues>({
    resolver: zodResolver(productionEntrySchema),
    defaultValues: {
      style_id: "",
      bundle_id: "",
      style_operation_id: "",
      worker_id: "",
      production_date: getLocalDateTime(),
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

  // Fetch styles
  const {
    data: styles,
    refetch: fetchStyles,
    isLoading: stylesLoading,
  } = useFetch<Style[]>({
    auto: true,
    url: `${base}/styles`,
  })

  // Fetch workers
  const {
    data: workers,
    refetch: fetchWorkers,
    isLoading: workersLoading,
  } = useFetch<GarmentWorker[]>({
    auto: true,
    url: `${base}/garment-workers`,
  })

  // Fetch bundles for selected style
  const {
    data: bundles,
    refetch: fetchBundles,
    isLoading: bundlesLoading,
  } = useFetch<Bundle[]>({
    auto: false,
  })

  // Fetch operations for selected style
  const {
    data: operations,
    refetch: fetchOperations,
    isLoading: operationsLoading,
  } = useFetch<StyleOperation[]>({
    auto: false,
  })

  // Create production entry
  const { refetch: createEntry, isLoading: saving } = useFetch({
    auto: false,
  })

  const selectedStyle = useMemo(
    () => styles?.find((style) => style.id === styleID),
    [styles, styleID]
  )

  const selectedBundle = useMemo(
    () => bundles?.find((bundle) => bundle.id === bundleID),
    [bundles, bundleID]
  )

  const selectedOperation = useMemo(
    () => operations?.find((operation) => operation.id === operationID),
    [operations, operationID]
  )

  const selectedWorker = useMemo(
    () => workers?.find((worker) => worker.id === workerID),
    [workers, workerID]
  )

  const bundleCount = bundles?.length || null
  const operationCount = operations?.length || null

  // use initial style id & bundle id from query
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

  // When the selected style changes, load its bundles and operations.
  useEffect(() => {
    if (!base || !styleID) return

    fetchBundles({
      url: `${base}/bundles?style_id=${encodeURIComponent(styleID)}`,
      onSuccess: (bundles) => {
        // if bundle id exists in bundles then dont clear it
        if (!bundles.some((bundle) => bundle.id === bundleID)) {
          setValue("bundle_id", "")
        }
      },
    })
    fetchOperations({
      url: `${base}/styles/${styleID}/operations`,
      onSuccess: () => {
        setValue("style_operation_id", "")
      },
    })
  }, [styleID, orgID])

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
          production_date: getLocalDateTime(),
          remarks: "",
        })
        // router.push("/production-entries")
      },
      onError: (e: any) => {
        toast.error(e?.message || "Failed to create production entry")
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

  return (
    <div className="relative flex flex-1 flex-col gap-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Scissors className="size-4" />
              Production context
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
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
              />

              {selectedStyle && <StyleFormInfo style={selectedStyle} />}
            </div>

            <div className="space-y-2">
              <FormSelect
                id="bundle_id"
                label={`Bundle ${bundleCount ? `(${bundleCount})` : ""}`}
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
              />

              {selectedBundle && <BundleFormInfo bundle={selectedBundle} />}
            </div>

            <div className="space-y-2">
              <FormSelect
                id="style_operation_id"
                label={`Operation ${operationCount ? `(${operationCount})` : ""}`}
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
              />

              {selectedOperation && (
                <OperationFormInfo operation={selectedOperation} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="sticky top-1/4 h-fit shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Worker production</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(submit)} className="space-y-4">
              <div className="space-y-2">
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
                />

                {selectedWorker && <WorkerFormInfo worker={selectedWorker} />}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Production quantity</p>

                <div className="rounded-md border bg-muted/30 px-3 py-3">
                  <p className="text-lg font-semibold tabular-nums">
                    {selectedBundle
                      ? `${selectedBundle.quantity.toLocaleString("en-IN")} pcs`
                      : "—"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    The full bundle quantity will be recorded for this
                    operation.
                  </p>
                </div>
              </div>

              <FormField
                id="production_date"
                label="Production date"
                type="datetime-local"
                register={register}
                errors={errors}
              />

              <FormField
                id="remarks"
                label="Remarks (optional)"
                placeholder="Work completed, notes..."
                register={register}
                errors={errors}
                isTextArea
                rows={3}
              />

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rate per piece</span>
                  <strong>
                    {selectedOperation
                      ? formatMoney(selectedOperation.rate_per_piece)
                      : "—"}
                  </strong>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estimated earnings
                  </span>

                  <strong className="text-xl tabular-nums">
                    {selectedOperation && selectedBundle
                      ? formatMoney(
                          selectedOperation.rate_per_piece *
                            selectedBundle.quantity
                        )
                      : "—"}
                  </strong>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Quantity and rate are taken from the selected bundle and
                  operation.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  saving ||
                  !styleID ||
                  !bundleID ||
                  !operationID ||
                  !workerID ||
                  !watch("production_date") ||
                  operationsLoading
                }
              >
                <CheckCircle2 className="mr-2 size-4" />
                {saving ? "Saving entry..." : "Add production entry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
