"use client"

import React from "react"
import {
  Controller,
  get,
  type Control,
  type FieldValues,
  type Path,
  type FieldError,
} from "react-hook-form"
import clsx from "clsx"
import { HelpCircle, Lock } from "lucide-react"

import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { State2 } from "../StateComponent"

export interface FormSelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface BaseProps {
  id: string
  label?: string
  options?: FormSelectOption[]
  errors?: Record<string, any>
  disabled?: boolean
  defaultValue?: string | string[]
  placeholder?: string
  className?: string
  parentClass?: string
  valueClass?: string
  type?: "single" | "multiple"
  dropdownContent?: React.ReactNode
  showLoader?: boolean
  emptyMessage?: string
  value?: string | string[]
  onChange?: (value: any) => void
  tooltipText?: string
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

export type FormSelectProps<T extends FieldValues = FieldValues> =
  ControlledProps<T> | UncontrolledProps

export default function FormSelect<T extends FieldValues = FieldValues>({
  id,
  label,
  control,
  options = [],
  errors = {},
  disabled = false,
  defaultValue = "",
  placeholder,
  className = "",
  parentClass = "",
  valueClass = "",
  type = "single",
  dropdownContent,
  showLoader = false,
  emptyMessage,
  value,
  onChange,
  tooltipText = "",
  ...props
}: FormSelectProps<T>) {
  const error = get(errors, id) as FieldError | undefined
  const hasError = !!error
  const hasOptions = options.length > 0

  const selectPlaceholder = placeholder || `Select ${label || id}`

  const noOptionsMessage =
    emptyMessage || `No ${label?.toLowerCase() || "options"} available`

  const selectClassName = clsx(
    "w-full",
    hasError ? "border-[#A90F26]" : "",
    className
  )

  const renderOptions = () =>
    options.map((option) => (
      <SelectItem
        key={option.value}
        value={option.value}
        disabled={option.disabled}
        className="flex items-center justify-start gap-2"
      >
        <div className="flex w-full items-center gap-1.5">
          {option.disabled && <Lock size={10} className="shrink-0" />}
          <span className="truncate">{option.label}</span>
        </div>
      </SelectItem>
    ))

  const renderMultiOptions = () =>
    options.map((option) => (
      <MultiSelectItem
        key={option.value}
        value={option.value}
        disabled={option.disabled}
        badgeLabel={option.label}
        className="flex items-center justify-start gap-2"
      >
        <div className="flex w-full items-center gap-1.5">
          {option.disabled && <Lock size={10} className="shrink-0" />}
          <span className="truncate">{option.label}</span>
        </div>
      </MultiSelectItem>
    ))

  const renderSingleSelect = (
    selectedValue: string,
    handleChange: (value: string) => void
  ) => {
    const selectedOption = options.find(
      (option) => option.value === selectedValue
    )

    return (
      <Select
        disabled={disabled}
        value={selectedValue}
        onValueChange={(value) => handleChange(value ?? "")}
        {...props}
      >
        <SelectTrigger className={selectClassName}>
          <SelectValue placeholder={selectPlaceholder}>
            {selectedOption?.label ?? selectPlaceholder}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {showLoader && dropdownContent}

          {!showLoader && hasOptions && (
            <>
              {dropdownContent}
              {renderOptions()}
            </>
          )}

          {!showLoader && !hasOptions && (
            <State2 color="yellow" isEmpty>
              {noOptionsMessage}
            </State2>
          )}
        </SelectContent>
      </Select>
    )
  }

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
                  <HelpCircle size={12} className="text-muted-foreground" />
                }
              />
              <TooltipContent side="top" className="w-fit text-center">
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
          render={({ field }) =>
            type === "multiple" ? (
              <MultiSelect
                values={field.value || []}
                onValuesChange={field.onChange}
                disabled={disabled}
                {...props}
              >
                <MultiSelectTrigger className={selectClassName}>
                  <MultiSelectValue
                    placeholder={selectPlaceholder}
                    className={valueClass}
                  />
                </MultiSelectTrigger>

                <MultiSelectContent
                  emptyMessage={
                    !showLoader && !hasOptions ? noOptionsMessage : false
                  }
                >
                  <MultiSelectGroup>
                    {showLoader && dropdownContent}
                    {!showLoader && hasOptions && renderMultiOptions()}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
            ) : (
              renderSingleSelect(field.value ?? "", field.onChange)
            )
          }
        />
      ) : type === "multiple" ? (
        <MultiSelect
          values={(value as string[]) || []}
          onValuesChange={onChange}
          disabled={disabled}
          {...props}
        >
          <MultiSelectTrigger className={selectClassName}>
            <MultiSelectValue
              placeholder={selectPlaceholder}
              className={valueClass}
            />
          </MultiSelectTrigger>

          <MultiSelectContent
            emptyMessage={!showLoader && !hasOptions ? noOptionsMessage : false}
          >
            <MultiSelectGroup>
              {showLoader && dropdownContent}
              {!showLoader && hasOptions && renderMultiOptions()}
            </MultiSelectGroup>
          </MultiSelectContent>
        </MultiSelect>
      ) : (
        renderSingleSelect((value as string) ?? "", onChange ?? (() => {}))
      )}

      {hasError && (
        <p
          className="mt-0.5 text-[9px] font-normal text-[#A90F26]"
          role="alert"
        >
          {error?.message}
        </p>
      )}
    </div>
  )
}
