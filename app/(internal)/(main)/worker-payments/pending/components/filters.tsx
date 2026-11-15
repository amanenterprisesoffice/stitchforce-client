"use client"

import { RotateCcw } from "lucide-react"

import FormSelect from "@/components/ui/FormSelect"
import FormDatePicker from "@/components/ui/FormDatePicker"
import DebouncedSearch from "@/components/ui/debounced-search"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { getWorkerName } from "@/utils/types/garmentWorker"
import type { GarmentWorker } from "@/utils/types/garmentWorker"
import type { Bundle } from "@/utils/types/bundle"
import type { Style } from "@/utils/types/style"
import type { StyleOperation } from "@/utils/types/styleops"

export type WorkerPaymentFiltersValue = {
  search: string
  workerID: string
  styleID: string
  bundleID: string
  operationID: string
  fromDate: string
  toDate: string
}

type FilterKey = keyof WorkerPaymentFiltersValue

interface Props {
  filters: WorkerPaymentFiltersValue
  workers: GarmentWorker[]
  styles: Style[]
  bundles: Bundle[]
  operations: StyleOperation[]
  workersLoading: boolean
  stylesLoading: boolean
  bundlesLoading: boolean
  operationsLoading: boolean
  onChange: <K extends FilterKey>(
    key: K,
    value: WorkerPaymentFiltersValue[K]
  ) => void
  onClear: () => void

  workersError?: string | null 
  stylesError?: string | null
  bundlesError?: string | null
  operationsError?: string | null
}

export default function WorkerPaymentFilters({
  filters,
  workers,
  styles,
  bundles,
  operations,
  workersLoading,
  stylesLoading,
  bundlesLoading,
  operationsLoading,
  onChange,
  onClear,
  workersError,
  stylesError,
  bundlesError,
  operationsError,
}: Props) {
  return (
    <Card className="sticky top-4 h-fit w-full shrink-0 lg:w-[280px]">
      <CardContent className="space-y-4">
        <DebouncedSearch
          value={filters.search}
          onChange={(value: string) => onChange("search", value)}
          placeholder="Search workers..."
          className="w-full"
        />

        <FormSelect
          label="Worker"
          id="worker-filter"
          value={filters.workerID}
          onChange={(value: string) =>
            onChange("workerID", value === "all" ? "" : value)
          }
          placeholder={workersLoading ? "Loading workers..." : "All workers"}
          parentClass="w-full min-w-0"
          options={[
            { value: "all", label: "All workers" },
            ...workers.map((worker) => ({
              value: worker.id,
              label: getWorkerName(worker),
            })),
          ]}
          error={workersError}
          searchBar
        />

        <FormSelect
          label="Style"
          id="style-filter"
          value={filters.styleID}
          onChange={(value: string) =>
            onChange("styleID", value === "all" ? "" : value)
          }
          placeholder={stylesLoading ? "Loading styles..." : "All styles"}
          parentClass="w-full min-w-0"
          options={[
            { value: "all", label: "All styles" },
            ...styles.map((style) => ({
              value: style.id,
              label: style.style_number
                ? `${style.style_number} · ${style.name}`
                : style.name,
            })),
          ]}
          error={stylesError}
          searchBar
        />

        <FormSelect
          label="Bundle"
          id="bundle-filter"
          value={filters.bundleID}
          onChange={(value: string) =>
            onChange("bundleID", value === "all" ? "" : value)
          }
          placeholder={bundlesLoading ? "Loading bundles..." : "All bundles"}
          parentClass="w-full min-w-0"
          options={[
            { value: "all", label: "All bundles" },
            ...bundles.map((bundle) => ({
              value: bundle.id,
              label: bundle.bundle_number,
            })),
          ]}
          disabled={bundlesLoading || !filters.styleID}
          error={bundlesError}
          searchBar
        />

        <FormSelect
          label="Operation"
          id="operation-filter"
          value={filters.operationID}
          onChange={(value: string) =>
            onChange("operationID", value === "all" ? "" : value)
          }
          placeholder={
            operationsLoading ? "Loading operations..." : "All operations"
          }
          parentClass="w-full min-w-0"
          error={operationsError}
          options={[
            { value: "all", label: "All operations" },
            ...operations.map((operation) => ({
              value: operation.id,
              label: operation.name,
            })),
          ]}
          disabled={operationsLoading || !filters.styleID}
          searchBar
        />

        <FormDatePicker
          id="payment-from-date"
          label="From Date"
          value={filters.fromDate}
          onChange={(value: string) => onChange("fromDate", value)}
          max={filters.toDate || undefined}
          placeholder="From date"
        />

        <FormDatePicker
          id="payment-to-date"
          label="To Date"
          value={filters.toDate}
          onChange={(value: string) => onChange("toDate", value)}
          min={filters.fromDate || undefined}
          placeholder="To date"
        />
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onClear}>
          <RotateCcw className="size-3" />
          Clear filters
        </Button>
      </CardFooter>
    </Card>
  )
}
