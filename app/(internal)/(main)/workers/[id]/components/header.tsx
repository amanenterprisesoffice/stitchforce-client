"use client"

import {
  Pencil,
  Trash2,
  UserRound,
  Share2,
  Copy,
  Phone,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"
import { GarmentWorker } from "@/utils/types/garmentWorker"

interface Props {
  worker: GarmentWorker
  onEdit: () => void
  onDelete: () => void
  onStatusChange: () => void
  isChangingStatus?: boolean
}

export default function GarmentWorkerDetailsHeader({
  worker,
  onEdit,
  onDelete,
  onStatusChange,
  isChangingStatus,
}: Props) {
  if (!worker) return null

  const phone = worker.phone?.replace(/\D/g, "")

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success("Worker link copied")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: worker.name,
          url: window.location.href,
        })
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error("Unable to share worker")
        }
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <PageHeader
      title={worker.name}
      icon={<UserRound className="size-5 text-muted-foreground" />}
      action={
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            title="Share worker"
          >
            <Share2 className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyLink}
            title="Copy worker link"
          >
            <Copy className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            disabled={!phone}
            onClick={() => window.open(`https://wa.me/${phone}`, "_blank")}
            title="WhatsApp worker"
            className="text-green-600 hover:text-green-700"
          >
            <FaWhatsapp className="size-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            disabled={!worker.phone}
            onClick={() =>
              (window.location.href = `tel:${worker.phone}`)
            }
            title="Call worker"
          >
            <Phone className="size-4" />
          </Button>

          <Button variant="outline" onClick={onEdit}>
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>

          <Button
            variant="outline"
            onClick={onStatusChange}
            disabled={isChangingStatus}
          >
            {isChangingStatus
              ? "Updating..."
              : worker.status === "active"
                ? "Deactivate"
                : "Activate"}
          </Button>

          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </>
      }
    />
  )
}