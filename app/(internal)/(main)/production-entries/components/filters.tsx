"use client"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import FormSelect from "@/components/ui/FormSelect"
import type {
  ProductionWorker,
  ProductionBundle,
  ProductionEntry,
  StyleOperation,
} from "../schema"
import { getWorkerName } from "../schema"

interface Props {
  workers: ProductionWorker[]
  bundles: ProductionBundle[]
  entries: ProductionEntry[]
  operations: StyleOperation[]
  workerFilter: string
  bundleFilter: string
  operationFilter: string
  onWorkerChange: (v: string) => void
  onBundleChange: (v: string) => void
  onOperationChange: (v: string) => void
  onClear: () => void
}
export default function ProductionEntryFilters(p: Props) {
  const usedOperations = new Set(p.entries.map((e) => e.style_operation_id))
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FormSelect
        id="workerFilter"
        value={p.workerFilter}
        onValueChange={p.onWorkerChange}
        placeholder="All workers"
        parentClass="w-full sm:w-[190px]"
        options={[
          { value: "all", label: "All workers" },
          ...p.workers.map((w) => ({ value: w.id, label: getWorkerName(w) })),
        ]}
      />
      <FormSelect
        id="bundleFilter"
        value={p.bundleFilter}
        onValueChange={p.onBundleChange}
        placeholder="All bundles"
        parentClass="w-full sm:w-[190px]"
        options={[
          { value: "all", label: "All bundles" },
          ...p.bundles.map((b) => ({ value: b.id, label: b.bundle_number })),
        ]}
      />
      <FormSelect
        id="operationFilter"
        value={p.operationFilter}
        onValueChange={p.onOperationChange}
        placeholder="All operations"
        parentClass="w-full sm:w-[190px]"
        options={[
          { value: "all", label: "All operations" },
          ...p.operations
            .filter((o) => usedOperations.has(o.id))
            .map((o) => ({ value: o.id, label: o.name })),
        ]}
      />
      <Button variant="ghost" size="sm" onClick={p.onClear}>
        <RotateCcw className="mr-2 size-4" />
        Clear filters
      </Button>
    </div>
  )
}
