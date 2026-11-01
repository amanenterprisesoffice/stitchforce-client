
"use client"

import type { Bundle } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { Size } from "@/utils/zodSchema/size"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  bundle: Bundle | null
  styles: Style[]
  sizes: Size[]
}

const statusConfig: Record<string, string> = {
  created: "secondary",
  ready: "default",
  in_progress: "outline",
  completed: "default",
  cancelled: "destructive",
}

const statusLabels: Record<string, string> = {
  created: "Created",
  ready: "Ready",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

export default function BundleDetailsDialog({
  open,
  onOpenChange,
  bundle,
  styles,
  sizes,
}: Props) {
  if (!bundle) return null

  const styleName =
    styles.find((style) => style.id === bundle.style_id)?.name ||
    "Unknown style"

  const sizeName =
    sizes.find((size) => size.id === bundle.size_id)?.name ||
    "Unknown size"

  const attributes = bundle.attributes || {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Bundle Details</DialogTitle>

          <DialogDescription>
            Complete information about this garment bundle.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Bundle Number
              </p>

              <p className="mt-1 font-mono text-lg font-semibold">
                {bundle.bundle_number}
              </p>
            </div>

            <Badge
              variant={
                (statusConfig[bundle.status] as
                  | "secondary"
                  | "default"
                  | "outline"
                  | "destructive") || "secondary"
              }
            >
              {statusLabels[bundle.status] || bundle.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Style
              </p>
              <p className="text-sm font-medium">{styleName}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Size
              </p>
              <p className="text-sm font-medium">{sizeName}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Quantity
              </p>
              <p className="text-sm font-semibold tabular-nums">
                {bundle.quantity.toLocaleString()} garments
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Created
              </p>
              <p className="text-sm font-medium">
                {bundle.created_at
                  ? new Date(bundle.created_at).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Manufacturing Attributes
            </h3>

            {Object.keys(attributes).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No attributes added.
              </p>
            ) : (
              <div className="rounded-lg border divide-y">
                {Object.entries(attributes).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4 p-3"
                  >
                    <span className="text-sm capitalize text-muted-foreground">
                      {key.replace(/_/g, " ")}
                    </span>

                    <span className="text-sm font-medium text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Remarks</h3>

            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {bundle.remarks || "No remarks added."}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
