
"use client"

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

type ScrollDirection = "vertical" | "horizontal" | "both"
type AutoScroll = boolean | "top" | "bottom"
type ScrollBehavior = "auto" | "instant" | "smooth"

interface ScrollShadows {
  top: boolean
  bottom: boolean
  left: boolean
  right: boolean
}

interface ScrollShadowProps {
  children: React.ReactNode
  className?: string
  parentClass?: string
  topShadowStyles?: React.CSSProperties
  bottomShadowStyles?: React.CSSProperties
  shadowColor?: string
  shadowColorDark?: string
  icon?: boolean
  direction?: ScrollDirection
  watch?: unknown
  id?: string
  autoScroll?: AutoScroll
  autoScrollBehavior?: ScrollBehavior
}

const SCROLL_AMOUNT = 80

const INITIAL_SHADOWS: ScrollShadows = {
  top: false,
  bottom: false,
  left: false,
  right: false,
}

export default function ScrollShadow({
  children,
  className = "",
  parentClass,
  topShadowStyles = {},
  bottomShadowStyles = {},
  shadowColor = "#e8e8e8",
  shadowColorDark = "#00000060",
  icon = true,
  direction = "vertical",
  watch,
  id,
  autoScroll = false,
  autoScrollBehavior = "smooth",
}: ScrollShadowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const { resolvedTheme } = useTheme()

  const [shadows, setShadows] = useState<ScrollShadows>(
    INITIAL_SHADOWS,
  )

  const isVertical =
    direction === "vertical" || direction === "both"

  const isHorizontal =
    direction === "horizontal" || direction === "both"

  const currentShadowColor =
    resolvedTheme === "dark" ? shadowColorDark : shadowColor

  const updateShadows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const nextShadows: ScrollShadows = {
      top: isVertical && el.scrollTop > 0,
      bottom:
        isVertical &&
        el.scrollTop + el.clientHeight + 1 < el.scrollHeight,
      left: isHorizontal && el.scrollLeft > 0,
      right:
        isHorizontal &&
        el.scrollLeft + el.clientWidth + 1 < el.scrollWidth,
    }

    setShadows((current) => {
      if (
        current.top === nextShadows.top &&
        current.bottom === nextShadows.bottom &&
        current.left === nextShadows.left &&
        current.right === nextShadows.right
      ) {
        return current
      }

      return nextShadows
    })
  }, [isVertical, isHorizontal])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    updateShadows()

    el.addEventListener("scroll", updateShadows, {
      passive: true,
    })

    window.addEventListener("resize", updateShadows)

    const resizeObserver = new ResizeObserver(updateShadows)

    resizeObserver.observe(el)

    if (el.firstElementChild) {
      resizeObserver.observe(el.firstElementChild)
    }

    return () => {
      el.removeEventListener("scroll", updateShadows)
      window.removeEventListener("resize", updateShadows)
      resizeObserver.disconnect()
    }
  }, [updateShadows])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !autoScroll) return

    const animationFrame = requestAnimationFrame(() => {
      el.scrollTo({
        top:
          autoScroll === "top"
            ? 0
            : isVertical
              ? el.scrollHeight
              : el.scrollTop,
        left:
          autoScroll === "top"
            ? 0
            : isHorizontal
              ? el.scrollWidth
              : el.scrollLeft,
        behavior: autoScrollBehavior,
      })

      updateShadows()
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [
    watch,
    autoScroll,
    autoScrollBehavior,
    isVertical,
    isHorizontal,
    updateShadows,
  ])

  useEffect(() => {
    updateShadows()
  }, [watch, updateShadows])

  const scroll = useCallback(
    (axis: "vertical" | "horizontal", amount: number) => {
      const el = scrollRef.current
      if (!el) return

      el.scrollBy({
        [axis === "vertical" ? "top" : "left"]: amount,
        behavior: "smooth",
      })

      requestAnimationFrame(updateShadows)
    },
    [updateShadows],
  )

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    axis: "vertical" | "horizontal",
    amount: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      scroll(axis, amount)
    }
  }

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        parentClass,
      )}
    >
      {isVertical && shadows.top && (
        <button
          type="button"
          aria-label="Scroll up"
          onClick={() => scroll("vertical", -SCROLL_AMOUNT)}
          onKeyDown={(event) =>
            handleKeyDown(event, "vertical", -SCROLL_AMOUNT)
          }
          className="absolute top-0 right-0 left-0 z-10 flex h-6 items-center justify-center"
          style={{
            background: `linear-gradient(to bottom, ${currentShadowColor}, transparent)`,
            ...topShadowStyles,
          }}
        >
          {icon && (
            <ChevronUp
              size={16}
              strokeWidth={2.5}
              className="rounded-full bg-white p-[1.5px] dark:bg-background"
            />
          )}
        </button>
      )}

      {isVertical && shadows.bottom && (
        <button
          type="button"
          aria-label="Scroll down"
          onClick={() => scroll("vertical", SCROLL_AMOUNT)}
          onKeyDown={(event) =>
            handleKeyDown(event, "vertical", SCROLL_AMOUNT)
          }
          className="absolute right-0 bottom-0 left-0 z-10 flex h-6 items-center justify-center"
          style={{
            background: `linear-gradient(to top, ${currentShadowColor}, transparent)`,
            ...bottomShadowStyles,
          }}
        >
          {icon && (
            <ChevronDown
              size={16}
              strokeWidth={2.5}
              className="rounded-full bg-white p-[1.5px] dark:bg-background"
            />
          )}
        </button>
      )}

      {isHorizontal && shadows.left && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scroll("horizontal", -SCROLL_AMOUNT)}
          onKeyDown={(event) =>
            handleKeyDown(event, "horizontal", -SCROLL_AMOUNT)
          }
          className="absolute top-0 bottom-0 left-0 z-10 flex w-6 items-center justify-center"
          style={{
            background: `linear-gradient(to right, ${currentShadowColor}, transparent)`,
          }}
        >
          {icon && (
            <ChevronLeft
              size={16}
              strokeWidth={2.5}
              className="rounded-full bg-white p-[1.5px] dark:bg-background"
            />
          )}
        </button>
      )}

      {isHorizontal && shadows.right && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scroll("horizontal", SCROLL_AMOUNT)}
          onKeyDown={(event) =>
            handleKeyDown(event, "horizontal", SCROLL_AMOUNT)
          }
          className="absolute top-0 right-0 bottom-0 z-10 flex w-6 items-center justify-center"
          style={{
            background: `linear-gradient(to left, ${currentShadowColor}, transparent)`,
          }}
        >
          {icon && (
            <ChevronRight
              size={16}
              strokeWidth={2.5}
              className="rounded-full bg-white p-[1.5px] dark:bg-background"
            />
          )}
        </button>
      )}

      <div
        ref={scrollRef}
        id={id}
        className={cn(
          "no-scrollbar",
          direction === "vertical"
            ? "h-full overflow-y-auto"
            : direction === "horizontal"
              ? "w-full overflow-x-auto"
              : "h-full w-full overflow-auto",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
