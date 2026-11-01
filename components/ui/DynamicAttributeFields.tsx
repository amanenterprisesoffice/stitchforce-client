
"use client"

import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface DynamicField {
  key: string
  value: string
}

interface DynamicAttributeFieldsProps {
  title?: string
  description?: string
  fields: DynamicField[]
  onChange: (fields: DynamicField[]) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
  addButtonLabel?: string
  emptyMessage?: string
}

export default function DynamicAttributeFields({
  title = "Attributes",
  description = "Add optional custom attributes.",
  fields,
  onChange,
  keyPlaceholder = "Attribute name",
  valuePlaceholder = "Attribute value",
  addButtonLabel = "Add",
  emptyMessage = "No attributes added yet.",
}: DynamicAttributeFieldsProps) {
  const addField = () => {
    onChange([
      ...fields,
      { key: "", value: "" },
    ])
  }

  const updateField = (
    index: number,
    property: keyof DynamicField,
    value: string
  ) => {
    const next = [...fields]

    next[index] = {
      ...next[index],
      [property]: value,
    }

    onChange(next)
  }

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">
            {title}
          </h3>

          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addField}
        >
          <Plus className="mr-1 size-4" />
          {addButtonLabel}
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-lg border border-dashed p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <Input
                placeholder={keyPlaceholder}
                value={field.key}
                onChange={(e) =>
                  updateField(index, "key", e.target.value)
                }
              />

              <Input
                placeholder={valuePlaceholder}
                value={field.value}
                onChange={(e) =>
                  updateField(index, "value", e.target.value)
                }
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive"
                onClick={() => removeField(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
