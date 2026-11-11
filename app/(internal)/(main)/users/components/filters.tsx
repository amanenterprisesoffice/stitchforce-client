"use client"

import FormSelect from "@/components/ui/FormSelect"
import DebouncedSearch from "@/components/ui/debounced-search"

interface Props {
  search: string
  role: string
  onSearchChange: (value: string) => void
  onRoleChange: (value: string) => void
}

export default function UserFilters({
  search,
  role,
  onSearchChange,
  onRoleChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative max-w-sm flex-1">
        <DebouncedSearch
          value={search}
          onChange={onSearchChange}
        />
      </div>

      <div className="w-full max-w-[200px]">
        <FormSelect
          id="user_role"
          label=""
          placeholder="All roles"
          value={role || "all"}
          onChange={(value: string) =>
            onRoleChange(value === "all" ? "" : value)
          }
          options={[
            { value: "all", label: "All roles" },
            { value: "org_admin", label: "Organization admin" },
            { value: "admin", label: "Admin" },
            { value: "staff", label: "Staff" },
          ]}
        />
      </div>
    </div>
  )
}