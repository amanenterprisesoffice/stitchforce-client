"use client"

import FormSelect from "@/components/ui/FormSelect"
import FormDatePicker from "@/components/ui/FormDatePicker"

import { getWorkerName } from "@/utils/zodSchema/garmentWorker"
import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import type { Bundle } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { StyleOperation } from "@/utils/zodSchema/styleops"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Search, X } from "lucide-react"
import FormField from "@/components/ui/FormField"
import DebouncedSearch from "@/components/ui/debounced-search"

export type ProductionEntryFiltersValue = {
  search: string
  workerID: string
  styleID: string
  bundleID: string
  operationID: string
  fromDate: string
  toDate: string
}

type FilterKey = keyof ProductionEntryFiltersValue

interface Props {
  filters: ProductionEntryFiltersValue
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
    value: ProductionEntryFiltersValue[K]
  ) => void
  onClear: () => void
}

export default function ProductionEntryFilters({
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
}: Props) {
  return (
    <Card className="sticky top-4 h-fit w-[20%] max-w-2xl">
      <CardContent className="space-y-4">
        <DebouncedSearch
          value={filters.search}
          onChange={(value: string) => onChange("search", value)}
          placeholder="Search production entries..."
          className="max-w-sm"
        />
     

        <FormSelect
          label="Worker"
          id="worker-filter"
          value={filters.workerID || "all"}
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
        />

        <FormSelect
          label="Style"
          id="style-filter"
          value={filters.styleID || "all"}
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
        />

        <FormSelect
          label="Bundle"
          id="bundle-filter"
          value={filters.bundleID || "all"}
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
        />

        <FormSelect
          label="Operation"
          id="operation-filter"
          value={filters.operationID || "all"}
          onChange={(value: string) =>
            onChange("operationID", value === "all" ? "" : value)
          }
          placeholder={
            operationsLoading ? "Loading operations..." : "All operations"
          }
          parentClass="w-full min-w-0"
          options={[
            { value: "all", label: "All operations" },
            ...operations.map((operation) => ({
              value: operation.id,
              label: operation.name,
            })),
          ]}
          disabled={operationsLoading || !filters.styleID}
        />

        <FormDatePicker
          id="production-from-date"
          label="From Date"
          value={filters.fromDate}
          onChange={(value: string) => onChange("fromDate", value)}
          max={filters.toDate || undefined}
          placeholder="From date"
        />

        <FormDatePicker
          id="production-to-date"
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
