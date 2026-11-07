import React from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LabeledSwitchRowProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  labelClassName?: string
  switchClassName?: string
  tooltipText?: string
  errors?: Record<string, { message?: string }>
}

const LabeledSwitchRow: React.FC<LabeledSwitchRowProps> = ({
  id,
  label,
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
  labelClassName = "",
  switchClassName = "",
  tooltipText = "",
  errors = {},
}) => {
  return (
    <div className="my-3">
      <div className={`flex items-center justify-between gap-2 ${className}`}>
        <div className="mb-1.5 flex items-center gap-1.5">
          <Label
            className={`block text-xs font-medium text-muted-foreground ${labelClassName}`}
          >
            {label}
          </Label>

          {tooltipText && (
            <Tooltip>
              <TooltipTrigger
                render={<HelpCircle size={12} className="stext-xs" />}
              />

              <TooltipContent side="top" className="w-fit max-w-sm text-center">
                {tooltipText}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <Switch
          size="sm"
          className={`!h-2 !w-[19px] [&_[data-slot=switch-thumb]]:!size-[9.2px] ${switchClassName}`}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>

      {errors[id] && (
        <div
          className="mt-[1px] text-[9px] font-normal text-[#A90F26]"
          role="alert"
        >
          {errors[id]?.message}
        </div>
      )}
    </div>
  )
}

export default LabeledSwitchRow
