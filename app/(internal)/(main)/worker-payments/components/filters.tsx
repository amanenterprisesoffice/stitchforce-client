
"use client"

import { RotateCcw } from "lucide-react"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import FormSelect from "@/components/ui/FormSelect"
import FormDatePicker from "@/components/ui/FormDatePicker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"

export type WorkerPaymentFiltersValue = {
  worker_id: string
  status: string
  from_date: string
  to_date: string
}

type FilterKey = keyof WorkerPaymentFiltersValue

interface Props {
  filters: WorkerPaymentFiltersValue
  onChange: <K extends FilterKey>(
    key: K,
    value: WorkerPaymentFiltersValue[K]
  ) => void
  onClear: () => void
}

export default function WorkerPaymentFilters({
  filters,
  onChange,
  onClear,
}: Props) {
  const { user } = useUser()

  const organizationID = user?.organization_id

  const base = organizationID
    ? `/api/organizations/${organizationID}`
    : ""

  // Fetch workers for the worker filter.
  const {
    data: workersResponse,
    isLoading: isWorkersLoading,
  } = useFetch<any>({
    auto: !!organizationID,
    url: `${base}/garment-workers`,
  })

  const workers: GarmentWorker[] = Array.isArray(workersResponse)
    ? workersResponse
    : workersResponse?.workers ??
      workersResponse?.garment_workers ??
      []

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <Card className="sticky top-4 h-fit w-[20%] max-w-2xl shrink-0">
      <CardContent className="space-y-4">
        {/* Worker */}
        <FormSelect
          id="worker_id"
          label="Worker"
          placeholder="All workers"
          value={filters.worker_id || "all"}
          onChange={(value: string) =>
            onChange("worker_id", value === "all" ? "" : value)
          }
          options={[
            { value: "all", label: "All workers" },
            ...workers.map((worker) => ({
              value: worker.id,
              label: worker.name,
            })),
          ]}
          searchBar
          showLoader={isWorkersLoading}
        />

        {/* Payment from */}
        <FormDatePicker
          id="from_date"
          label="Payment from"
          value={filters.from_date}
          onChange={(value: string) => onChange("from_date", value)}
          placeholder="From date"
          max={filters.to_date || undefined}
        />

        {/* Payment to */}
        <FormDatePicker
          id="to_date"
          label="Payment to"
          value={filters.to_date}
          onChange={(value: string) => onChange("to_date", value)}
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
          onClick={onClear}
        >
          <RotateCcw className="size-3" />
          Clear filters
        </Button>
      </CardFooter>
    </Card>
  )
}
