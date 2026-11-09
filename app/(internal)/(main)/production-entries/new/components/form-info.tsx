"use client"

import type { ReactNode, ElementType } from "react"
import Link from "next/link"

import { Shirt, Package, Scissors, UserRound, ArrowUpRight } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { formatMoney, getInitials } from "@/utils/utils"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import type { Bundle } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { StyleOperation } from "@/utils/zodSchema/styleops"
import { WorkerInfo } from "@/components/ui/worker-avatar"

// -------------------------------------
// REUSABLE COMPONENTS
// -------------------------------------

function EmptyInfo({
  title,
  text,
  icon: Icon = UserRound,
}: {
  title: string
  text: string
  icon?: ElementType
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{title}</p>

      <div className="flex min-w-0 items-center gap-3 rounded-xl border border-dashed bg-muted/20 px-4 py-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/50">
          <Icon className="size-4 text-muted-foreground" />
        </div>

        <p className="min-w-0 text-xs break-words text-muted-foreground">
          {text}
        </p>
      </div>
    </div>
  )
}

function CompactInfo({
  title,
  href,
  children,
  className = "",
}: {
  title: string
  href?: string
  children: ReactNode
  className?: string
}) {
  const content = (
    <div
      className={`relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border p-3 transition-all ${href && "hover:border-primary/40 hover:bg-muted/30 hover:shadow-sm"} sm:p-4 ${className}`}
    >
      {children}

      {href && (
        <ArrowUpRight className="absolute top-3 right-3 size-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
      )}
    </div>
  )

  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{title}</p>

      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {content}
        </Link>
      ) : (
        <div className="group h-full">{content}</div>
      )}
    </div>
  )
}

function InfoHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
  avatar,
}: {
  icon?: ElementType
  title: string
  subtitle?: string
  badge?: ReactNode
  avatar?: ReactNode
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {avatar ?? (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
          {Icon && <Icon className="size-4 text-muted-foreground" />}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug font-semibold break-words">
          {title}
        </p>

        {subtitle && (
          <p className="mt-1 text-xs break-words text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {badge && <div className="ml-auto shrink-0">{badge}</div>}
    </div>
  )
}

function InfoBadge({ children }: { children: ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="max-w-[100px] shrink-0 text-[10px] capitalize"
    >
      <span className="truncate">{children}</span>
    </Badge>
  )
}

// -------------------------------------
// STYLE
// -------------------------------------

export function StyleFormInfo({ style }: { style: Style | undefined }) {
  if (!style) {
    return <EmptyInfo title="Style" text="No style selected" icon={Shirt} />
  }

  return (
    <CompactInfo title="Style Information" href={`/styles/${style.id}`}>
      <InfoHeader
        icon={Shirt}
        title={style.name}
        subtitle={
          style.style_number ? `Style ${style.style_number}` : "Selected style"
        }
      />

      {style.description && (
        <p className="mt-3 line-clamp-3 border-t pt-3 text-xs leading-relaxed [overflow-wrap:anywhere] text-muted-foreground">
          {style.description}
        </p>
      )}
    </CompactInfo>
  )
}

// -------------------------------------
// BUNDLE
// -------------------------------------

export function BundleFormInfo({ bundle }: { bundle: Bundle | undefined }) {
  if (!bundle) {
    return <EmptyInfo title="Bundle" text="No bundle selected" icon={Package} />
  }

  return (
    <CompactInfo title="Bundle Information" href={`/bundles/${bundle.id}`}>
      <InfoHeader
        icon={Package}
        title={bundle.bundle_number}
        subtitle={`${Number(bundle.quantity).toLocaleString("en-IN")} pieces`}
        badge={<InfoBadge>{bundle.status.replace(/_/g, " ")}</InfoBadge>}
      />

      {bundle.remarks && (
        <p className="mt-3 line-clamp-3 border-t pt-3 text-xs leading-relaxed [overflow-wrap:anywhere] text-muted-foreground">
          {bundle.remarks}
        </p>
      )}
    </CompactInfo>
  )
}

// -------------------------------------
// OPERATION
// -------------------------------------

export function OperationFormInfo({
  operation,
}: {
  operation: StyleOperation | undefined
}) {
  if (!operation) {
    return (
      <EmptyInfo
        title="Operation"
        text="No operation selected"
        icon={Scissors}
      />
    )
  }

  return (
    <CompactInfo title="Operation Information">
      <InfoHeader
        icon={Scissors}
        title={operation.name}
        subtitle="Selected operation"
        badge={<InfoBadge>{formatMoney(operation.rate_per_piece)}</InfoBadge>}
      />
    </CompactInfo>
  )
}

// -------------------------------------
// WORKER
// -------------------------------------

export function WorkerFormInfo({
  worker,
}: {
  worker: GarmentWorker | undefined
}) {
  if (!worker) {
    return <EmptyInfo title="Worker" text="No worker selected" />
  }

  return (
    <CompactInfo title="Worker Information" href={`/workers/${worker.id}`}>
      <WorkerInfo
        worker={worker}
        linkMode="none"
        avatarClassName="size-10 shrink-0"
        nameClassName="text-sm"
      />
    </CompactInfo>
  )
}
