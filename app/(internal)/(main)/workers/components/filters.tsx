"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import FormSelect from "@/components/ui/FormSelect"
import DebouncedSearch from "@/components/ui/debounced-search"

interface Props {
  search: string
  status: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export default function WorkerFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative max-w-sm flex-1">
      <DebouncedSearch 
    //   label="Search Workers"
        value={search}
        onChange={onSearchChange}
      />
      </div>

      <div className="w-full max-w-[200px]">
        <FormSelect
          id="worker_status"
          label=""
          placeholder="All statuses"
          value={status || "all"}
          onChange={(value: string) =>
            onStatusChange(value === "all" ? "" : value)
          }
          options={[
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </div>
    </div>
  )
}