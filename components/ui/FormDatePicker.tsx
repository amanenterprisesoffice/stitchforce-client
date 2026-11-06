
"use client"

import * as React from "react"
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form"
import { ChevronDownIcon, HelpCircle } from "lucide-react"
import clsx from "clsx"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BaseProps {
  id: string
  label?: string
  errors?: Record<string, any>
  disabled?: boolean
  defaultValue?: string
  placeholder?: string
  className?: string
  parentClass?: string
  tooltipText?: string
  captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years"
  value?: string
  onChange?: (value: string) => void
  [key: string]: any
}

type ControlledProps<T extends FieldValues> = BaseProps & {
  control: Control<T>
  id: Path<T>
  value?: never
  onChange?: never
}

type UncontrolledProps = BaseProps & {
  control?: undefined
}

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ""
  // If it's a Date object, extract the calendar date as YYYY-MM-DD
  if (date instanceof Date && !isNaN(date.getTime())) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
  // If it's already a string (e.g., from the calendar), just return first 10 chars
  if (typeof date === "string") return date.slice(0, 10)
  return ""
}

export type FormDatePickerProps<T extends FieldValues = FieldValues> =
  ControlledProps<T> | UncontrolledProps

function FormDatePicker<T extends FieldValues = FieldValues>({
  id,
  label,
  control,
  errors = {},
  disabled = false,
  defaultValue,
  placeholder = "Select date",
  className = "",
  parentClass = "",
  tooltipText = "",
  captionLayout = "dropdown",
  onChange,
  value,
  ...props
}: FormDatePickerProps<T>) {
  const [open, setOpen] = React.useState(false)

  const hasError = !!errors?.[id]

  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    value
      ? new Date(value)
      : defaultValue
        ? new Date(defaultValue)
        : new Date()
  )

  const handleLocalChange = (date: Date | undefined) => {
    if (!date) return

    const plainDate = formatDate(date)

    onChange?.(plainDate)
    setCurrentMonth(date)
    setOpen(false)
  }

  const triggerClassName = clsx(
    "w-full justify-between font-normal",
    hasError ? "border-[#A90F26]" : "",
    className
  )

  return (
    <div className={clsx("w-full", parentClass)}>
      {label && (
        <div className="mb-1.5 flex items-center gap-1.5">
          <Label
            htmlFor={id}
            className="block text-xs font-medium text-muted-foreground"
          >
            {label}
          </Label>

          {tooltipText && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <HelpCircle
                    size={12}
                    className="text-xs text-muted-foreground"
                  />
                }
              />
              <TooltipContent side="top">
                {tooltipText}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      {control ? (
        <Controller
          name={id as Path<T>}
          control={control}
          defaultValue={defaultValue as any}
          render={({ field }) => {
            const [controlledMonth, setControlledMonth] =
              React.useState<Date>(
                field.value ? new Date(field.value) : new Date()
              )

            return (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      id={id}
                      disabled={disabled}
                      className={triggerClassName}
                      {...props}
                    >
                      {field.value
                        ? formatDate(field.value)
                        : placeholder}

                      <ChevronDownIcon />
                    </Button>
                  }
                />

                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={
                      field.value ? new Date(field.value) : undefined
                    }
                    month={controlledMonth}
                    captionLayout={captionLayout}
                    onMonthChange={setControlledMonth}
                    onSelect={(date) => {
                      if (!date) return

                      const plainDate = formatDate(date)

                      field.onChange(plainDate)
                      setControlledMonth(date)
                      setOpen(false)
                    }}
                    disabled={disabled}
                    {...props}
                  />
                </PopoverContent>
              </Popover>
            )
          }}
        />
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id={id}
                disabled={disabled}
                className={triggerClassName}
                {...props}
              >
                {value ? formatDate(value) : placeholder}
                <ChevronDownIcon />
              </Button>
            }
          />

          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              month={currentMonth}
              captionLayout={captionLayout}
              onMonthChange={setCurrentMonth}
              onSelect={handleLocalChange}
              disabled={disabled}
              {...props}
            />
          </PopoverContent>
        </Popover>
      )}

      {hasError && (
        <p
          className="mt-0.5 text-[9px] font-normal text-[#A90F26]"
          role="alert"
        >
          {errors?.[id]?.message}
        </p>
      )}
    </div>
  )
}

export default FormDatePicker
