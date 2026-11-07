"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Label } from "@/components/ui/label"
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form"
import clsx from "clsx"
import { useEffect } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import type { ComponentType } from "react"
import ScrollShadow from "./ScrollShadow"

type ToggleOption = {
  value: string
  label: string
  icon?: ComponentType<{ size?: number; className?: string }>
}

type LabeledToggleGroupProps<T extends FieldValues = FieldValues> = {
  name: Path<T>
  label?: string
  control?: Control<T>
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  options?: ToggleOption[]
  errors?: Record<string, { message?: string }>
  className?: string
  ToggleGroupClassName?: string
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  tooltipText?: string
  disabled?: boolean
}

const FormToggleGroup = <T extends FieldValues = FieldValues>({
  name,
  label,
  control,
  value: controlledValue,
  onChange: controlledOnChange,
  options = [],
  errors = {},
  className = "",
  ToggleGroupClassName = "",
  type = "single",
  defaultValue,
  tooltipText = "",
  disabled = false,
}: LabeledToggleGroupProps<T>) => {
  let value = controlledValue
  let onChange = controlledOnChange

  if (control) {
    const {
      field: { value: formValue, onChange: formOnChange },
    } = useController({ name, control })

    value = formValue
    onChange = formOnChange
  }

  const hasError = !!errors?.[name]

  const handleValueChange = (val: string | string[]) => {
    if (type === "single") {
      const selectedValue = Array.isArray(val) ? (val[0] ?? "") : val

      if (selectedValue) {
        onChange?.(selectedValue)
      }
    } else {
      const selectedValues = Array.isArray(val) ? val : val ? [val] : []

      onChange?.(selectedValues)
    }
  }

  const normalizedValue =
  type === "single"
    ? Array.isArray(value)
      ? value[0] ?? ""
      : value ?? ""
    : Array.isArray(value)
      ? value
      : value
        ? [value]
        : []

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <div className="mb-1.5 flex items-center gap-1.5">
          <Label className="block text-xs font-medium text-muted-foreground">
            {label}
          </Label>

          {tooltipText && (
            <Tooltip>
              <TooltipTrigger
                render={<HelpCircle size={12} className="text-xs" />}
              ></TooltipTrigger>

              <TooltipContent side="top" className="max-w-sm text-center">
                {tooltipText}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      <ScrollShadow
        direction="both"
        className="flex-1 overflow-x-auto"
        watch={options}
      >
        <ToggleGroup
          value={normalizedValue as string & string[]}
          onValueChange={handleValueChange as never}
          className={clsx("w-fit min-w-full flex-nowrap", ToggleGroupClassName)}
          multiple={type === "multiple"}
        >
          {options.map(({ value: val, label, icon: Icon }) => (
            <ToggleGroupItem
              key={val}
              value={val}
              className="flex min-w-fit items-center gap-1 border px-3 py-1 text-xs"
              disabled={disabled}
            >
              {Icon && <Icon size={16} className="mr-1 !text-[16px]" />}
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ScrollShadow>

      {hasError && (
        <p className="mt-1 text-[9px] text-[#A90F26]" role="alert">
          {errors[name]?.message}
        </p>
      )}
    </div>
  )
}

export default FormToggleGroup
