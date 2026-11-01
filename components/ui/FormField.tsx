"use client"
import React, { useState, useMemo, ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import clsx from "clsx"
import { Textarea } from "./textarea"

// Define the types for the component props
interface FormFieldProps {
  id: string
  label?: string
  placeholder?: string
  register?: any
    registerOptions?: Record<string, any>;
  icon?: ReactNode
  parentClass?: string
  errors?: any
  className?: string
  isSecret?: boolean
  isTextArea?: boolean
  hasEndIcon?: boolean
  endChildren?: ReactNode
  endProps?: React.HTMLProps<HTMLDivElement>
  [key: string]: any // This will allow additional props to be passed
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  placeholder,
  register,
  registerOptions,
  icon,
  parentClass = "",
  errors = {},
  className = "",
  isSecret = false,
  isTextArea = false,
  hasEndIcon = false,
  endChildren,
  endProps,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const inputType = useMemo(() => {
    if (isSecret) {
      return isVisible ? "text" : "password"
    }

    return props.type || "text"
  }, [isSecret, isVisible, props.type])
  return (
    <div className={clsx("grid w-full gap-1", parentClass)}>
      {label && (
        <Label htmlFor={id} className="pb-1">
          {label}
        </Label>
      )}

      <div className="relative w-full">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground peer-focus:text-foreground">
            {icon}
          </div>
        )}

        {isSecret && (
          <div
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-muted-foreground peer-focus:text-foreground"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label="Toggle password visibility"
          >
            {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
          </div>
        )}

        {hasEndIcon && (
          <div
            className="absolute inset-y-0 right-3 flex cursor-pointer items-center pr-1 peer-focus:text-foreground"
            {...endProps}
          >
            {endChildren}
          </div>
        )}

        {isTextArea ? (
          <Textarea
            id={id}
            placeholder={placeholder}
            {...(register ? register(id, registerOptions) : {})}
            className={clsx(
              "peer w-full text-sm",
              icon ? "pl-9" : "pl-3",
              errors[id] ? "border-destructive/80" : "",
              className
            )}
            {...props}
          />
        ) : (
          <Input
            id={id}
            type={inputType}
            placeholder={placeholder}
            {...(register ? register(id, registerOptions) : {})}
            className={clsx(
              "peer w-full text-sm",
              icon ? "pl-9" : "pl-3",
              errors[id] ? "border-destructive/80" : "",
              className
            )}
            {...props}
          />
        )}
      </div>

      {errors[id] && (
        <p className="text-xs text-destructive/80" role="alert">
          {errors[id]?.message}
        </p>
      )}
    </div>
  )
}

export default FormField
