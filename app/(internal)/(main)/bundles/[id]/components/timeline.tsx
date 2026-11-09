"use client"

import {
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Package,
  PackageCheck,
  Play,
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline"

import { cn } from "@/lib/utils"

import type { BundleStatus } from "@/utils/zodSchema/bundle"
import { STATUS_LABELS } from "@/utils/zodSchema/bundle"

const STATUS_STEPS: {
  key: BundleStatus
  title: string
  description: string
  actionLabel: string
  icon: React.ElementType
}[] = [
  {
    key: "created",
    title: "Created",
    description: "Bundle registered in the system.",
    actionLabel: "",
    icon: Package,
  },
  {
    key: "ready",
    title: "Ready",
    description: "Prepared for production.",
    actionLabel: "Mark as Ready",
    icon: CheckCircle2,
  },
  {
    key: "in_progress",
    title: "In Progress",
    description: "Manufacturing is underway.",
    actionLabel: "Start Production",
    icon: Play,
  },
  {
    key: "completed",
    title: "Completed",
    description: "All production work is finished.",
    actionLabel: "Mark as Completed",
    icon: PackageCheck,
  },
]

const STATUS_ORDER: Record<BundleStatus, number> = {
  created: 0,
  ready: 1,
  in_progress: 2,
  completed: 3,
}

interface BundleTimelineProps {
  status: BundleStatus
  isUpdating?: boolean
  onAdvance: (status: BundleStatus) => void
}

export default function BundleTimeline({
  status,
  isUpdating = false,
  onAdvance,
}: BundleTimelineProps) {
  const currentIndex = STATUS_ORDER[status]
  const nextStep = STATUS_STEPS[currentIndex + 1]
  const completed = status === "completed"

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="w-full p-5 sm:p-8">
        <Timeline
          value={currentIndex + 1}
          orientation="horizontal"
          className="w-full"
        >
          {STATUS_STEPS.map((step, index) => {
            const isDone = index < currentIndex
            const isCurrent = index === currentIndex
            const Icon = step.icon

            return (
              <TimelineItem key={step.key} step={index + 1}>
                <TimelineHeader>
                  <TimelineSeparator
                    className={cn(
                      "bg-border!",
                      "group-data-[orientation=horizontal]/timeline:-top-6",
                      "group-data-[orientation=horizontal]/timeline:left-2.5",
                      "group-data-[orientation=horizontal]/timeline:w-[calc(100%-2.25rem)]",
                      isDone && "bg-primary!"
                    )}
                  />

                  <TimelineDate>
                    {isDone
                      ? "Completed"
                      : isCurrent
                        ? "Current stage"
                        : "Upcoming"}
                  </TimelineDate>

                  <TimelineTitle className="text-sm font-semibold">
                    {step.title}
                  </TimelineTitle>

                  <TimelineIndicator
                    className={cn(
                      "flex size-6 items-center justify-center border-none",
                      isDone && "bg-primary text-primary-foreground",
                      isCurrent && "bg-primary text-primary-foreground",
                      !isDone &&
                        !isCurrent &&
                        "bg-muted text-muted-foreground"
                    )}
                  >
                    {isDone ? (
                      <Check className="size-3.5" />
                    ) : isCurrent ? (
                      <Icon className="size-3.5" />
                    ) : (
                      <Circle className="size-3" />
                    )}
                  </TimelineIndicator>
                </TimelineHeader>

                <TimelineContent className="text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </TimelineContent>
              </TimelineItem>
            )
          })}
        </Timeline>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-4 border-t bg-muted/20 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        {completed ? (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-5" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Production completed
              </p>
              <p className="text-xs text-muted-foreground">
                All production stages have been completed successfully.
              </p>
            </div>
          </div>
        ) : nextStep ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Clock3 className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Next step: {nextStep.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Current status: {STATUS_LABELS[status]}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => onAdvance(nextStep.key)}
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              {isUpdating ? (
                "Updating..."
              ) : (
                <>
                  {nextStep.actionLabel}
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Unrecognized bundle status.
          </p>
        )}
      </CardFooter>
    </Card>
  )
}