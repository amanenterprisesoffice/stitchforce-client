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
import { User } from "@/utils/types/user"

interface Props {
  user: User
  onEdit: () => void
  onDelete: () => void
}

export default function UserDetailsHeader({
  user,
  onEdit,
  onDelete,
}: Props) {
  if (!user) return null


  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success("Worker link copied")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: user.name,
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
      title={user.name}
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

          <Button variant="outline" onClick={onEdit}>
            <Pencil className="mr-2 size-4" />
            Edit
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