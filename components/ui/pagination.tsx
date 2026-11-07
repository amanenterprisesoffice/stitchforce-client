
"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PaginationProps {
  limit: number
  offset: number
  itemCount: number
  totalItems?: number
  hasNextPage: boolean
  pageSizeOptions?: number[]
  onPageChange: (nextOffset: number) => void
  onLimitChange: (nextLimit: number) => void
}

export default function Pagination({
  limit,
  offset,
  itemCount,
  totalItems,
  hasNextPage,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const [isChangingPage, setIsChangingPage] = useState(false)
  const clickLock = useRef(false)

  const start = itemCount === 0 ? 0 : offset + 1
  const end = offset + itemCount

  const currentPage = Math.floor(offset / limit) + 1

  const totalPages =
    totalItems === undefined
      ? undefined
      : Math.max(1, Math.ceil(totalItems / limit))

  const handlePageChange = (nextOffset: number) => {
    if (clickLock.current) return

    clickLock.current = true
    setIsChangingPage(true)

    onPageChange(nextOffset)
  }

  // Unlock when the parent updates the pagination offset.
  // Also handles cases where the requested offset doesn't change.
  const previousOffset = useRef(offset)

  if (previousOffset.current !== offset) {
    previousOffset.current = offset
    clickLock.current = false
    setIsChangingPage(false)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {start}–{end}
        </span>

        {totalItems !== undefined && (
          <>
            {" "}
            of{" "}
            <span className="font-medium text-foreground">
              {totalItems}
            </span>
          </>
        )}

        <span className="mx-2">·</span>

        <span>
          Page {currentPage}
          {totalPages !== undefined ? ` of ${totalPages}` : ""}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          Rows per page
        </span>

        <Select
          value={String(limit)}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger className="h-9 w-[76px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9"
          aria-label="Previous page"
          disabled={offset === 0 || isChangingPage}
          onClick={() =>
            handlePageChange(Math.max(0, offset - limit))
          }
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9"
          aria-label="Next page"
          disabled={!hasNextPage || isChangingPage}
          onClick={() =>
            handlePageChange(offset + limit)
          }
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
