"use client"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import FormField from "@/components/ui/FormField"

type DebouncedSearchProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  delay?: number
  label?: string
}

export default function DebouncedSearch({
  value,
  onChange,
  placeholder = "Search...",
  className = "max-w-sm",
  delay = 350,
  label = "",
}: DebouncedSearchProps) {
  const [search, setSearch] = useState(value)

  useEffect(() => {
    setSearch(value)
  }, [value])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (search !== value) {
        onChange(search.trim())
      }
    }, delay)

    return () => window.clearTimeout(timer)
  }, [search, delay, onChange, value])

  return (
    <FormField
      id="search"
      label={label}
      placeholder={placeholder}
      icon={
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      }
      value={search}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        setSearch(event.target.value)
      }
      parentClass="relative max-w-sm"
      className={`pl-9 w-full relative ${className}`}
      hasEndIcon={!!search}
      endChildren={
        <X
          className="size-4 cursor-pointer"
          onClick={() => {
            setSearch("")
            onChange("")
          }}
        />
      }
    />
  )
}