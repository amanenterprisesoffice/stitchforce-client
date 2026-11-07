"use client"

import { useEffect, useState } from "react"
import type {
  ProductionEntry,
  UpdateProductionEntryPayload,
} from "@/utils/zodSchema/production-entry"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Loader from "@/components/ui/Loader"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDate } from "@/utils/utils"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: ProductionEntry
  onSubmit: (values: UpdateProductionEntryPayload) => Promise<void>
  isSaving: boolean
}

export default function EditProductionEntryDialog({
  open,
  onOpenChange,
  entry,
  onSubmit,
  isSaving,
}: Props) {
  const [bundleID, setBundleID] = useState(entry.bundle_id)
  const [workerID, setWorkerID] = useState(entry.worker_id)
  const [quantity, setQuantity] = useState(String(entry.quantity))
  const [productionDate, setProductionDate] = useState(formatDate(entry.production_date))
  const [remarks, setRemarks] = useState(entry.remarks || "")

  useEffect(() => {
    if (!open) return
    setBundleID(entry.bundle_id)
    setWorkerID(entry.worker_id)
    setQuantity(String(entry.quantity))
    setProductionDate(formatDate(entry.production_date))
    setRemarks(entry.remarks || "")
  }, [open, entry])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsedQuantity = Number(quantity)

    if (!bundleID || !workerID || !productionDate || !Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return
    }

    await onSubmit({
      bundle_id: bundleID,
      worker_id: workerID,
      production_date: new Date(productionDate).toISOString(),
      remarks: remarks.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Edit production entry</DialogTitle>
          <DialogDescription>
            Update the bundle, worker, quantity, date, and remarks. The operation and recorded rate remain unchanged.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entry-bundle">Bundle ID</Label>
            <Input id="entry-bundle" value={bundleID} onChange={(event) => setBundleID(event.target.value)} required />
            <p className="text-xs text-muted-foreground">Current bundle: {entry.bundle?.bundle_number || entry.bundle_id}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-worker">Worker ID</Label>
            <Input id="entry-worker" value={workerID} onChange={(event) => setWorkerID(event.target.value)} required />
            <p className="text-xs text-muted-foreground">Current worker: {entry.worker?.name || entry.worker_id}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-quantity">Quantity</Label>
            <Input id="entry-quantity" type="number" min={1} step={1} value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-date">Production date</Label>
            <Input id="entry-date" type="datetime-local" value={productionDate} onChange={(event) => setProductionDate(event.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-remarks">Remarks</Label>
            <Textarea id="entry-remarks" maxLength={1000} rows={3} value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Additional production notes..." />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !bundleID || !workerID || !productionDate || Number(quantity) <= 0}>
              {isSaving && <Loader />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
