"use client"

import { Layers } from "lucide-react"

import DataTable from "@/components/ui/DataTable"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { prettifyKey } from "@/utils/utils"

interface Props {
  attributes: Record<string, unknown>
}

export default function ManufacturingAttributes({ attributes }: Props) {
  const data = Object.entries(attributes).map(([key, value]) => ({
    key,
    value,
  }))

  const columns = [
    {
      header: "Attribute",
      className: "w-[40%] font-medium",
      render: (item: (typeof data)[number]) => prettifyKey(item.key),
    },
    {
      header: "Value",
      className: "break-words text-right",
      render: (item: (typeof data)[number]) => (
        <span className="break-words text-muted-foreground">
          {typeof item.value === "object" && item.value !== null
            ? JSON.stringify(item.value)
            : String(item.value ?? "—")}
        </span>
      ),
    },
  ]

  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          Manufacturing attributes
        </CardTitle>
        <CardDescription>
          Additional specifications attached to this bundle.
        </CardDescription>
      </CardHeader>

      <DataTable
        data={data}
        columns={columns}
        getRowId={(item) => item.key}
        emptyMessage="No attributes found."
        isLoading={false}
        className="rounded-none"
      />
    </Card>
  )
}
