import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getInitials } from "@/utils/utils"
import { GarmentWorker, SlimWorker } from "@/utils/types/garmentWorker"

interface WorkerInfoProps {
  worker: GarmentWorker | SlimWorker | undefined
  linkMode?: "full" | "name" | "none"
  className?: string
  avatarClassName?: string
  imageClassName?: string
  fallbackClassName?: string
  linkClassName?: string
  detailsClassName?: string
  nameClassName?: string
  phoneClassName?: string
  // ignore obj conatinning fields not to show
  ignoreFields?: string[]
}

export function WorkerInfo({
  worker,
  linkMode = "full",
  className,
  avatarClassName,
  imageClassName,
  fallbackClassName,
  detailsClassName,
  nameClassName,
  phoneClassName,
  linkClassName,
  ignoreFields = ["gender"],
}: WorkerInfoProps) {
  const href = worker ? `/workers/${worker.id}` : "#"

  const avatar = (
    <Avatar className={cn("size-9 shrink-0", avatarClassName)}>
      <AvatarImage
        src={worker?.photo_url || undefined}
        alt={worker?.name || "Unknown worker"}
        className={imageClassName}
      />
      <AvatarFallback className={fallbackClassName}>
        {getInitials(worker?.name || "Unknown worker")}
      </AvatarFallback>
    </Avatar>
  )

  const name = (
    <p className={cn("truncate font-medium", nameClassName)}>
      {worker?.name || "Unknown worker"}
    </p>
  )

  const phone = !ignoreFields.includes("phone") && (
    <p className={cn("text-xs text-muted-foreground", phoneClassName)}>
      {worker?.phone || "—"}
    </p>
  )

  const gender = !ignoreFields.includes("gender") && worker && "gender" in worker && worker.gender && (
    <p className="text-xs text-muted-foreground capitalize">{worker.gender}</p>
  )

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {linkMode === "full" ? (
        <Link
          href={href}
          onClick={(event) => event.stopPropagation()}
          className={cn("flex min-w-0 items-center gap-3", linkClassName)}
        >
          {avatar}
          <div className={cn("min-w-0", detailsClassName)}>
            <p
              className={cn(
                "truncate text-sm font-semibold group-hover:text-primary",
                nameClassName
              )}
            >
              {name}
            </p>
            {phone}
          </div>
        </Link>
      ) : (
        <>
          {avatar}
          <div className={cn("min-w-0", detailsClassName)}>
            {linkMode === "name" && !ignoreFields.includes("name") ? (
              <Link
                href={href}
                onClick={(event) => event.stopPropagation()}
                className={cn("hover:underline", linkClassName)}
              >
                {name}
              </Link>
            ) : (
              name
            )}
            {gender}
            {phone}
          </div>
        </>
      )}
    </div>
  )
}
