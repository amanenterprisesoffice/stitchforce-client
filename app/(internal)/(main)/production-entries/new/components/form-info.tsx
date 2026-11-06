"use client"

import type { ReactNode } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import {
  Shirt,
  Package,
  Scissors,
} from "lucide-react"

import {
  formatMoney,
  getInitials,
} from "@/utils/utils"

import type { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import type { Bundle } from "@/utils/zodSchema/bundle"
import type { Style } from "@/utils/zodSchema/style"
import type { StyleOperation } from "@/utils/zodSchema/styleops"

function Detail({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  if (children === undefined || children === null || children === "") {
    return null
  }

  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-sm font-medium">{children}</p>
    </div>
  )
}

function Summary({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background border">
          <Icon className="size-4 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {children && (
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3 sm:grid-cols-3">
          {children}
        </div>
      )}
    </div>
  )
}

export function StyleFormInfo({ style }: { style: Style }) {
  return (
    <Summary
      icon={Shirt}
      title={style.name}
      subtitle={
        style.style_number
          ? `Style ${style.style_number}`
          : "Selected style"
      }
    >
      {style.description && (
        <div className="col-span-full">
          <Detail label="Description">{style.description}</Detail>
        </div>
      )}
    </Summary>
  )
}

export function BundleFormInfo({ bundle }: { bundle: Bundle }) {
  const attributes = Object.entries(bundle.attributes ?? {})

  return (
    <Summary
      icon={Package}
      title={bundle.bundle_number}
      subtitle="Selected bundle"
    >
      <Detail label="Quantity">
        {Number(bundle.quantity).toLocaleString("en-IN")} pcs
      </Detail>

      <Detail label="Status">
        <Badge variant="outline" className="h-5 capitalize">
          {bundle.status.replace(/_/g, " ")}
        </Badge>
      </Detail>

      {attributes.map(([key, value]) => (
        <Detail key={key} label={key.replace(/_/g, " ")}>
          {String(value)}
        </Detail>
      ))}

      {bundle.remarks && (
        <div className="col-span-full">
          <Detail label="Remarks">{bundle.remarks}</Detail>
        </div>
      )}
    </Summary>
  )
}

export function OperationFormInfo({
  operation,
}: {
  operation: StyleOperation
}) {
  return (
    <Summary
      icon={Scissors}
      title={operation.name}
      subtitle="Selected operation"
    >
      <Detail label="Rate per piece">
        {formatMoney(operation.rate_per_piece)}
      </Detail>
    </Summary>
  )
}

export function WorkerFormInfo({ worker }: { worker: GarmentWorker }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarImage
            src={worker.photo_url || undefined}
            alt={worker.name}
          />
          <AvatarFallback>
            {getInitials(worker.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{worker.name}</p>
          <p className="text-xs text-muted-foreground">
            {worker.phone || "No phone number"}
          </p>
        </div>

        <Badge variant="outline" className="capitalize">
          {worker.status}
        </Badge>
      </div>

      {worker.gender && (
        <div className="mt-3 border-t pt-3">
          <Detail label="Gender">
            <span className="capitalize">{worker.gender}</span>
          </Detail>
        </div>
      )}
    </div>
  )
}