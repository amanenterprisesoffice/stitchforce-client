"use client"

import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { RotateCcw } from "lucide-react"

import FormSelect from "@/components/ui/FormSelect"
import FormDatePicker from "@/components/ui/FormDatePicker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"

const filterSchema = z.object({
  worker_id: z.string(),
  status: z.string(),
  from_date: z.string(),
  to_date: z.string(),
})

export type WorkerPaymentFiltersValue = z.infer<typeof filterSchema>

interface Props {
  workers: GarmentWorker[]
  onChange: (filters: WorkerPaymentFiltersValue) => void
  onClear: () => void
}

const initialValues: WorkerPaymentFiltersValue = {
  worker_id: "",
  status: "",
  from_date: "",
  to_date: "",
}

export default function WorkerPaymentFilters({
  workers,
  onChange,
  onClear,
}: Props) {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<WorkerPaymentFiltersValue>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialValues,
  })

  const filters = useWatch({ control })

  const hasFilters = Object.values(filters).some(Boolean)

  useEffect(() => {
    onChange({
      worker_id: filters.worker_id ?? "",
      status: filters.status ?? "",
      from_date: filters.from_date ?? "",
      to_date: filters.to_date ?? "",
    })
  }, [
    filters.worker_id,
    filters.status,
    filters.from_date,
    filters.to_date,
    onChange,
  ])

  const handleClear = () => {
    reset(initialValues)
    onClear()
  }

  return (
    <Card className="sticky top-4 h-fit w-[20%] max-w-2xl shrink-0">
      <CardContent className="space-y-4">
        {/* Worker */}
        <FormSelect
          id="worker_id"
          label="Worker"
          placeholder="All workers"
          register={register}
          errors={errors}
          options={[
            { value: "all", label: "All workers" },
            ...workers.map((worker) => ({
              value: worker.id,
              label: worker.name,
            })),
          ]}
          value={filters?.worker_id || "all"}
          onChange={(value: string) =>
            reset({
              ...filters,
              worker_id: value === "all" ? "" : value,
            })
          }
          searchBar
        />

        {/* Status */}
        <FormSelect
          id="status"
          label="Status"
          placeholder="All statuses"
          register={register}
          errors={errors}
          options={[
            { value: "all", label: "All statuses" },
            { value: "completed", label: "Completed" },
            { value: "voided", label: "Voided" },
          ]}
          value={String(filters?.status || "all")}
          onChange={(value: string) =>
            reset({
              ...filters,
              status: value === "all" ? "" : value,
            })
          }
        />

        {/* Payment from */}
        <FormDatePicker
          id="from_date"
          label="Payment from"
          control={control}
          errors={errors}
          placeholder="From date"
          max={filters.to_date || undefined}
        />

        {/* Payment to */}
        <FormDatePicker
          id="to_date"
          label="Payment to"
          control={control}
          errors={errors}
          placeholder="To date"
          min={filters.from_date || undefined}
        />
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasFilters}
          onClick={handleClear}
        >
          <RotateCcw className="size-3" />
          Clear filters
        </Button>
      </CardFooter>
    </Card>
  )
}
