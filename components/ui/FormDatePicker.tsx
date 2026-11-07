"use client"

import * as React from "react"
import type {
  DropdownNavProps,
  DropdownProps,
} from "react-day-picker"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatDate } from "@/utils/utils"

// --------------------------------------------------
// TYPES
// --------------------------------------------------

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

  captionLayout?:
    | "label"
    | "dropdown"
    | "dropdown-months"
    | "dropdown-years"

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

export type FormDatePickerProps<
  T extends FieldValues = FieldValues,
> = ControlledProps<T> | UncontrolledProps

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const formatDateLocal = (date: Date | string | undefined) => {
  if (!date) return ""

  if (date instanceof Date && !isNaN(date.getTime())) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  if (typeof date === "string") {
    return date.slice(0, 10)
  }

  return ""
}

const parseDate = (value?: string) => {
  if (!value) return undefined

  const [year, month, day] = value.slice(0, 10).split("-").map(Number)

  if (!year || !month || !day) return undefined

  const date = new Date(year, month - 1, day)

  return isNaN(date.getTime()) ? undefined : date
}

// --------------------------------------------------
// CUSTOM DROPDOWN
// --------------------------------------------------

const handleCalendarChange = (
  value: string | number,
  onChange: React.ChangeEventHandler<HTMLSelectElement>
) => {
  const event = {
    target: {
      value: String(value),
    },
  } as React.ChangeEvent<HTMLSelectElement>

  onChange(event)
}

const CalendarDropdown = (props: DropdownProps) => {
  return (
    <Select
      value={String(props.value)}
      onValueChange={(value) => {
        if (props.onChange && value !== null) {
          handleCalendarChange(value, props.onChange)
        }
      }}
      disabled={props.disabled}
    >
      <SelectTrigger className="h-8 min-w-0 first:grow">
        <SelectValue>
          {props.options?.find(
            (option) => String(option.value) === String(props.value)
          )?.label}
        </SelectValue>
      </SelectTrigger>

      <SelectContent align="start">
        {props.options?.map((option) => (
          <SelectItem
            key={option.value}
            value={String(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const CalendarDropdownNav = (props: DropdownNavProps) => (
  <div className="flex w-full items-center gap-2">
    {props.children}
  </div>
)

const calendarComponents = {
  Dropdown: CalendarDropdown,
  DropdownNav: CalendarDropdownNav,
}

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

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
    () => parseDate(value) ?? parseDate(defaultValue) ?? new Date()
  )

  const triggerClassName = clsx(
    "w-full justify-between font-normal",
    hasError && "border-[#A90F26]",
    className
  )

  // --------------------------------------------------
  // CALENDAR
  // --------------------------------------------------

  const renderCalendar = (
    selectedDate: Date | undefined,
    month: Date,
    onSelect: (date: Date | undefined) => void,
    onMonthChange: (date: Date) => void
  ) => (
    <Calendar
      mode="single"
      selected={selectedDate}
      month={month}
      captionLayout={captionLayout}
      onMonthChange={onMonthChange}
      onSelect={onSelect}
      hideNavigation
      disabled={disabled}
      components={calendarComponents}
      classNames={{
        month_caption: "mx-0",
      }}
      {...props}
    />
  )

  // --------------------------------------------------
  // TRIGGER
  // --------------------------------------------------

  const renderTrigger = (displayValue?: string) => (
    <Button
      variant="outline"
      id={id}
      type="button"
      disabled={disabled}
      className={triggerClassName}
    >
      {displayValue ? formatDate(displayValue) : placeholder}
      <ChevronDownIcon className="size-4 opacity-50" />
    </Button>
  )

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

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
                    className="text-muted-foreground"
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
            const selectedDate = parseDate(field.value)

            return (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger render={renderTrigger(field.value)} />

                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  {renderCalendar(
                    selectedDate,
                    currentMonth,
                    (date) => {
                      if (!date) return

                      const formatted = formatDateLocal(date)

                      field.onChange(formatted)
                      setCurrentMonth(date)
                      setOpen(false)
                    },
                    setCurrentMonth
                  )}
                </PopoverContent>
              </Popover>
            )
          }}
        />
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger render={renderTrigger(value)} />

          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="start"
          >
            {renderCalendar(
              parseDate(value),
              currentMonth,
              (date) => {
                if (!date) return

                onChange?.(formatDateLocal(date))
                setCurrentMonth(date)
                setOpen(false)
              },
              setCurrentMonth
            )}
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
