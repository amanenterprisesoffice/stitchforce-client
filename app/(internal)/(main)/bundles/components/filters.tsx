"use client"

import { RotateCcw, Search, X } from "lucide-react"

import type { Style } from "@/utils/zodSchema/style"
import type { Size } from "@/utils/zodSchema/size"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import FormSelect from "@/components/ui/FormSelect"
import FormDatePicker from "@/components/ui/FormDatePicker"
import { Input } from "@/components/ui/input"
import FormField from "@/components/ui/FormField"

interface Props {
  search: string
  onSearchChange: (value: string) => void
  styles: Style[]
  sizes: Size[]
  styleFilter: string
  sizeFilter: string
  statusFilter: string
  createdFrom: string
  createdTo: string
  onStyleChange: (value: string) => void
  onSizeChange: (value: string) => void
  onStatusChange: (value: string) => void
  onCreatedFromChange: (value: string) => void
  onCreatedToChange: (value: string) => void
  onClear: () => void
}

const statusOptions = [
  { value: "created", label: "Created" },
  { value: "ready", label: "Ready" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

export default function BundleFilters({
  styles,
  sizes,
  styleFilter,
  sizeFilter,
  statusFilter,
  createdFrom,
  createdTo,
  search,
  onSearchChange,
  onStyleChange,
  onSizeChange,
  onStatusChange,
  onCreatedFromChange,
  onCreatedToChange,
  onClear,
}: Props) {
  const hasFilters = [
    styleFilter,
    sizeFilter,
    statusFilter,
    createdFrom,
    createdTo,
  ].some((value) => value && value !== "all")

  return (
    <Card className="sticky top-4 h-fit w-[20%] max-w-2xl">
      <CardContent className="space-y-4">
        <FormField
          id="search"
          label="Find Bundles"
          placeholder="Search bundles..."
          icon={
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          }
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(event.target.value)
          }
          className="pl-9"
          hasEndIcon={!!search}
          endChildren={
            <X className="size-4" onClick={() => onSearchChange("")} />
          }
        />

        <FormSelect
          label="Style"
          id="style-filter"
          value={styleFilter || "all"}
          onChange={(value: string) =>
            onStyleChange(value === "all" ? "" : value)
          }
          placeholder="All styles"
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
          label="Size"
          id="size-filter"
          value={sizeFilter || "all"}
          onChange={(value: string) =>
            onSizeChange(value === "all" ? "" : value)
          }
          placeholder="All sizes"
          parentClass="w-full min-w-0"
          options={[
            { value: "all", label: "All sizes" },
            ...sizes.map((size) => ({
              value: size.id,
              label: size.name,
            })),
          ]}
        />

        <FormSelect
          label="Status"
          id="status-filter"
          value={statusFilter || "all"}
          onChange={(value: string) =>
            onStatusChange(value === "all" ? "" : value)
          }
          placeholder="All statuses"
          parentClass="w-full min-w-0"
          options={[{ value: "all", label: "All statuses" }, ...statusOptions]}
        />

        <FormDatePicker
          id="created-from-date"
          label="Created From"
          value={createdFrom}
          onChange={onCreatedFromChange}
          max={createdTo || undefined}
          placeholder="From date"
        />

        <FormDatePicker
          id="created-to-date"
          label="Created To"
          value={createdTo}
          onChange={onCreatedToChange}
          min={createdFrom || undefined}
          placeholder="To date"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClear}
        >
          <RotateCcw className="size-3" />
          Clear filters
        </Button>
      </CardFooter>
    </Card>
  )
}
