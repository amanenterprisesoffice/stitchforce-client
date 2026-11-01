"use client"
import { useEffect, useState } from "react"
import type { ProductionEntry, ProductionWorker } from "../schema"
import { getWorkerName } from "../schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import FormSelect from "@/components/ui/FormSelect"
import Loader from "@/components/ui/Loader"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Props {
  entry: ProductionEntry | null
  open: boolean
  onOpenChange: (v: boolean) => void
  workers: ProductionWorker[]
  onSubmit: (v: {
    worker_id: string
    quantity: number
    production_date: string
    remarks: string
  }) => Promise<void>
  isSaving: boolean
}
export default function EditProductionEntryDialog(p: Props) {
  const [workerID, setWorkerID] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [date, setDate] = useState("")
  const [remarks, setRemarks] = useState("")
  useEffect(() => {
    if (p.open && p.entry) {
      setWorkerID(p.entry.worker_id)
      setQuantity(String(p.entry.quantity))
      setDate(new Date(p.entry.production_date).toISOString().slice(0, 16))
      setRemarks(p.entry.remarks || "")
    }
  }, [p.open, p.entry])
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = Number(quantity)
    if (!Number.isInteger(q) || q <= 0) return
    await p.onSubmit({
      worker_id: workerID,
      quantity: q,
      production_date: date,
      remarks,
    })
  }
  return (
    <Dialog open={p.open} onOpenChange={p.onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit production entry</DialogTitle>
          <DialogDescription>
            Update the worker, quantity, date, and remarks. Bundle and operation
            are retained.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Worker</label>
            <FormSelect
              id="edit-worker"
              value={workerID}
              onValueChange={setWorkerID}
              options={p.workers.map((w) => ({
                value: w.id,
                label: getWorkerName(w),
              }))}
              placeholder="Select worker"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Production date</label>
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Remarks</label>
            <Textarea
              maxLength={1000}
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => p.onOpenChange(false)}
              disabled={p.isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                p.isSaving ||
                !workerID ||
                !date ||
                !Number.isInteger(Number(quantity)) ||
                Number(quantity) <= 0
              }
            >
              {p.isSaving && <Loader />}Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
