"use client"

import { FileText, X } from "lucide-react"
import { useRef } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface FileInputProps {
  id: string
  label: string
  value: File[]
  onChange: (files: File[]) => void
  error?: string
  multiple?: boolean
  disabled?: boolean
}

export default function FileInput({
  id,
  label,
  value = [],
  onChange,
  error,
  multiple = false,
  disabled = false,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    onChange(multiple ? [...value, ...files] : files.slice(0, 1))

    // Allow selecting the same file again.
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Input
        ref={inputRef}
        id={id}
        type="file"
        multiple={multiple}
        disabled={disabled}
        accept="image/*"
        onChange={handleFileChange}
        className="bg-background"
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {value.length > 0 && (
        <div className="mt-2 space-y-2">
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="size-4 shrink-0 text-muted-foreground" />

                <span className="truncate text-sm">{file.name}</span>

                <span className="shrink-0 text-xs text-muted-foreground">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                disabled={disabled}
                onClick={() => removeFile(index)}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}