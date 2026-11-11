"use client"

import { Package, Plus, Shirt, ExternalLink } from "lucide-react"
import type { BundleStatus } from "@/utils/types/bundle"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/PageHeader"
import { Bundle, STATUS_LABELS } from "@/utils/types/bundle"
import { Style } from "@/utils/types/style"
import { Badge } from "@/components/ui/badge"
import { prettifyKey } from "@/utils/utils"

interface Props {
  bundle: Bundle | null
  style?: Style | null
  styleLoading?: boolean
}

export default function BundleDetailsHeader({ bundle, style, styleLoading }: Props) {
  return (
    <PageHeader
      title={bundle?.bundle_number || "Bundle Details"}
      description={`${style?.name || (styleLoading ? "Loading style…" : "Style details")}${
        style?.style_number ? ` · ${style.style_number}` : ""
      }`}
      icon={<Package className="size-5 text-muted-foreground" />}
      badge={bundle && <StatusBadge status={bundle.status} />}
      action={
        <div className="flex gap-2">
          <Button
            size="sm"
            render={
              <Link
                href={`/production-entries?bundle_id=${encodeURIComponent(bundle?.id || "")}`}
              />
            }
          >
            View production entries
          </Button>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/styles/${bundle?.style_id || ""}`} />}
          >
            View style
          </Button>
        </div>
      }
    />
  )
}

function StatusBadge({ status }: { status: BundleStatus }) {
  const styles: Record<BundleStatus, string> = {
    created:
      "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
    ready:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
    in_progress:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    completed:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  }

  return (
    <Badge variant="outline" className={styles[status]}>
      {STATUS_LABELS[status] || prettifyKey(status || "unknown")}
    </Badge>
  )
}

