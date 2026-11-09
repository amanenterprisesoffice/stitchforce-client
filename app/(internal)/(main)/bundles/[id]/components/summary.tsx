"use client"

import Link from "next/link"
import {
  Package,
  Ruler,
  Shirt,
  CalendarDays,
  Clock,
  Settings,
} from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"

import type { Bundle } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import { formatDate } from "@/utils/utils"

// Import your existing formatDate utility
// import { formatDate } from "@/utils/formatDate"

interface BundleSummaryProps {
  bundle: Bundle
  style: Style | null
  sizeName?: string | null
  operationCount?: number | null
}

export default function BundleSummary({
  bundle,
  style,
  sizeName,
  operationCount,
}: BundleSummaryProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Quantity */}
        <Card className="shadow-none">
          <CardContent className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Quantity
              </p>

              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {bundle.quantity}
              </p>

              <p className="text-xs text-muted-foreground">
                Total pieces in this bundle
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Package className="size-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Size */}
        <Card className="shadow-none">
          <CardContent className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Size</p>

              <p className="text-3xl font-semibold tracking-tight">
                {sizeName || "—"}
              </p>

              <p className="text-xs text-muted-foreground">
                Bundle size specification
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Ruler className="size-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Style */}
        <Card className="shadow-none">
          <CardContent className="flex flex-row items-center justify-between">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Style</p>

              {style ? (
                <Link
                  href={`/styles/${style.id}`}
                  className="block truncate text-2xl font-semibold tracking-tight hover:underline"
                >
                  {style.name}
                </Link>
              ) : (
                <p className="text-3xl font-semibold tracking-tight">—</p>
              )}

              <p className="text-xs text-muted-foreground">
                {style?.style_number
                  ? `Style No. ${style.style_number}`
                  : "Associated bundle style"}
              </p>
            </div>

            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Shirt className="size-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Operations */}
        <Card className="shadow-none">
          <CardContent className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Operations
              </p>

              <p className="text-3xl font-semibold tracking-tight">
                {operationCount ?? 0}
              </p>

              <p className="text-xs text-muted-foreground">
                Total number of operations in this bundle
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Settings className="size-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Bundle Details */}

      {bundle.remarks?.trim() && (
        <Card className="w-full py-0">
          <CardFooter className="flex flex-col space-y-1 border-0">
            <p className="w-full text-sm font-medium text-muted-foreground">
              Remarks
            </p>
            <p className="w-full text-sm break-words whitespace-pre-wrap">
              {bundle.remarks}
            </p>
          </CardFooter>
        </Card>
      )}
    
    </>
  )
}
