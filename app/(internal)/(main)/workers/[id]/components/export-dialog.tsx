
"use client"

import { useState } from "react"
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileType,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import FormToggleGroup from "@/components/ui/FormToggleGroup"
import { useUser } from "@/contexts/UserContext"

type ExportFormat = "csv" | "xlsx" | "pdf"

const EXPORT_OPTIONS = [
  {
    value: "csv",
    label: "CSV",
    icon: FileText,
  },
  {
    value: "xlsx",
    label: "Excel",
    icon: FileSpreadsheet,
  },
  {
    value: "pdf",
    label: "PDF",
    icon: FileType,
  },
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  endpoint: string
  workerName: string
  workerID: string
}

export default function WorkerExportDialog({
  open,
  onOpenChange,
  title,
  description,
  endpoint,
  workerName,
  workerID,
}: Props) {
  const { user } = useUser()

  const [format, setFormat] = useState<ExportFormat>("xlsx")

  const handleDownload = () => {
    if (!user?.organization_id) return

    const params = new URLSearchParams({
      format,
      worker_id: workerID,
    })

    const url =
      `${endpoint}?${params.toString()}`

    const downloadURL =
      `/api/organizations/${user.organization_id}${url}`

    window.open(downloadURL, "_blank", "noopener,noreferrer")

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>
            {description}{" "}
            <span className="font-medium text-foreground">
              {workerName}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <FormToggleGroup
          name="exportFormat"
          value={format}
          onChange={(value) =>
            setFormat(value as ExportFormat)
          }
          options={EXPORT_OPTIONS}
          type="single"
          ToggleGroupClassName="w-full"
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDownload}
            disabled={!user?.organization_id}
          >
            <Download className="mr-2 size-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
