import React from "react"
import { FlameKindlingIcon, Shirt } from "lucide-react"

import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

interface StateProps {
  ICON?: React.ReactNode
  message: string
  description?: string
  PortalButton?: React.ReactNode
  className?: string
}
const colorMap: Record<string, string> = {
  red: "text-red-500",
  blue: "text-blue-500",
  green: "text-green-500",
  yellow: "text-yellow-500",
  // Add more colors as needed
}

const StateComponent: React.FC<StateProps> = ({
  ICON,
  message,
  description,
  PortalButton,
  className,
}) => {
  return (
    <Card className={`flex h-full w-full flex-1 items-center justify-center border-dashed shadow-none ${className}`}>
      <CardContent className="flex max-w-md flex-col items-center space-y-0! text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted">
          {ICON || (
            <FlameKindlingIcon className="size-8 text-muted-foreground" />
          )}
        </div>

        <h3 className="text-lg font-semibold">{message || ""}</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {description || ""}
        </p>
        {PortalButton}
      </CardContent>
    </Card>
  )
}

export default StateComponent

export const State2: React.FC<{
  title?: string
  className?: string
  color?: string
  children?: React.ReactNode
  icon?: React.ReactNode
  btnIcon?: React.ComponentType<{ className?: string; size?: number }>
  btnText?: string
  btnClass?: string
  onBtnClick?: () => void
  isEmpty?: boolean
  haveBorder?: boolean
}> = ({
  title,
  className = "",
  color,
  children,
  icon: MainIcon,
  btnIcon: BtnIcon,
  btnText,
  btnClass,
  onBtnClick,
  isEmpty,
  haveBorder = false,
}) => {
  const colorClass = colorMap[color ?? "default"]
  return (
    <div
      className={`mx-auto flex h-full min-h-14 max-w-sm flex-col items-center justify-center space-y-2 text-center text-xs font-medium ${colorClass} ${className} ${isEmpty && "text-muted-foreground italic"} ${haveBorder && "w-full max-w-full! rounded-md border border-dashed border-muted-foreground/20"}`}
    >
      {MainIcon}
      <div>{children || title}</div>
      {btnText && (
        <button
          className={`mt-1 flex cursor-pointer items-center gap-1 font-medium ${btnClass}`}
          onClick={onBtnClick}
        >
          {btnText}
          {BtnIcon && <BtnIcon className="-mt-0.5 ml-1 inline" size={15} />}
        </button>
      )}
    </div>
  )
}
