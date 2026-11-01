"use client"

import { RotateCcw } from "lucide-react"

import type { Style } from "@/utils/zodSchema/style"
import type { Size } from "@/utils/zodSchema/size"

import { Button } from "@/components/ui/button"
import FormSelect from "@/components/ui/FormSelect"

interface Props {
  styles: Style[]
  sizes: Size[]

  styleFilter: string
  sizeFilter: string
  statusFilter: string

  onStyleChange: (value: string) => void
  onSizeChange: (value: string) => void
  onStatusChange: (value: string) => void
  onClear: () => void
}

export default function BundleFilters({
  styles,
  sizes,
  styleFilter,
  sizeFilter,
  statusFilter,
  onStyleChange,
  onSizeChange,
  onStatusChange,
  onClear,
}: Props) {
  const statusOptions = [
    { value: "created", label: "Created" },
    { value: "ready", label: "Ready" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  return (
    <div className="flex  flex-wrap items-center gap-3">
      {/* Style Filter */}
      <FormSelect
        id="styleFilter"
        placeholder="All Styles"
        value={styleFilter}
        onValueChange={onStyleChange}
        options={[
          { value: "all", label: "All Styles" },
          ...styles.map((style) => ({
            value: style.id,
            label: style.name,
          })),
        ]}
        parentClass="w-full sm:w-[170px]"
      />

      {/* Size Filter */}
      <FormSelect
        id="sizeFilter"
        placeholder="All Sizes"
        value={sizeFilter}
        onValueChange={onSizeChange}
        options={[
          { value: "all", label: "All Sizes" },
          ...sizes.map((size) => ({
            value: size.id,
            label: size.name,
          })),
        ]}
        parentClass="w-full sm:w-[170px]"
      />

      {/* Status Filter */}
      <FormSelect
        id="statusFilter"
        placeholder="All Statuses"
        value={statusFilter}
        onValueChange={onStatusChange}
        options={[{ value: "all", label: "All Statuses" }, ...statusOptions]}
        parentClass="w-full sm:w-[170px]"
      />

      <Button variant="ghost" size="sm" onClick={onClear} className="w-fit">
        <RotateCcw className="mr-2 size-4" />
        Clear filters
      </Button>
    </div>
  )
}
