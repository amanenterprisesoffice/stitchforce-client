"use client"

import Link from "next/link"
import { ArrowLeft, Book, Pencil, Trash2 } from "lucide-react"

import type { ProductionEntry } from "@/utils/types/production-entry"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/ui/PageHeader"

interface Props {
  // entry: ProductionEntry
}

export default function AddNewProdEntryHeader({}: Props) {
  return (
    <PageHeader
      title="Add Production entry"
      // backlink="/production-entries"
      icon={<Book className="size-5 text-muted-foreground" />}
      // badge={
      //   <Badge variant="secondary" className="font-mono">
      //     {/* {entry.id.slice(0, 8)} */}
      //   </Badge>
      // }
      // action={

      // }
      description="Review the worker, bundle, operation, quantity, and payment details for this production record."
    />
  )
}
