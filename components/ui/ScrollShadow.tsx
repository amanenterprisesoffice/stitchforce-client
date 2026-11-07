"use client"

import React, { useEffect, useRef, useState } from "react"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
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

  const { forcedTheme: theme, systemTheme } = useTheme()

  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark")

  const currentShadowColor = isDark ? shadowColorDark : shadowColor

  const [shadows, setShadows] = useState<ScrollShadows>({
    top: false,
    bottom: false,
    left: false,
    right: false,
  })

  const SCROLL_AMOUNT = 80

  // Update shadow visibility
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const update = () => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollLeft,
        scrollWidth,
        clientWidth,
      } = el

      setShadows({
        top: scrollTop > 0,
        bottom: scrollTop + clientHeight + 1 < scrollHeight,
        left: scrollLeft > 0,
        right: scrollLeft + clientWidth + 1 < scrollWidth,
      })
    }

    update()

    el.addEventListener("scroll", update)
    window.addEventListener("resize", update)

    return () => {
      el.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  // Auto scroll
  useEffect(() => {
    if (!autoScroll) return

    const el = scrollRef.current
    if (!el) return

    const animationFrame = requestAnimationFrame(() => {
      if (autoScroll === "top") {
        el.scrollTo({
          top: 0,
          behavior: autoScrollBehavior,
        })
      } else {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: autoScrollBehavior,
        })
      }
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [watch, autoScroll, autoScrollBehavior])

  // Recalculate shadows when watch changes
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = el

    setShadows({
      top: scrollTop > 0,
      bottom: scrollTop + clientHeight + 1 < scrollHeight,
      left: scrollLeft > 0,
      right: scrollLeft + clientWidth + 1 < scrollWidth,
    })
  }, [watch])

  // Scroll handler
  const scroll = (axis: "vertical" | "horizontal", amount: number) => {
    if (!scrollRef.current) return

    if (axis === "vertical") {
      scrollRef.current.scrollBy({
        top: amount,
        behavior: "smooth",
      })
    } else {
      scrollRef.current.scrollBy({
        left: amount,
        behavior: "smooth",
      })
    }
  }

  // Keyboard handler
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    axis: "vertical" | "horizontal",
    amount: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      scroll(axis, amount)
    }
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", parentClass)}>
      {/* Vertical Shadows */}

      {(direction === "vertical" || direction === "both") && shadows.top && (
        <div
          onClick={() => scroll("vertical", -SCROLL_AMOUNT)}
          className="absolute top-0 right-0 left-0 z-10 flex h-6 cursor-pointer items-center justify-center"
          style={{
            background: `linear-gradient(to bottom, ${currentShadowColor}, transparent)`,
            ...topShadowStyles,
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, "vertical", -SCROLL_AMOUNT)}
        >
          {icon && (
            <ChevronUp
              size={16}
              strokeWidth={2.5}
              className="rounded-full bg-white p-[1.5px] dark:bg-background"
            />
          )}
        </div>
      )}

      {(direction === "vertical" || direction === "both") && shadows.bottom && (
        <div
          onClick={() => scroll("vertical", SCROLL_AMOUNT)}
          className="absolute right-0 bottom-0 left-0 z-10 flex h-6 cursor-pointer items-center justify-center"
          style={{
            background: `linear-gradient(to top, ${currentShadowColor}, transparent)`,
            ...bottomShadowStyles,
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, "vertical", SCROLL_AMOUNT)}
        >
          {icon && (
            <ChevronDown
              size={16}
              strokeWidth={2.5}
              className="rounded-full bg-white p-[1.5px] dark:bg-background"
            />
          )}
        </div>
      )}

      {/* Horizontal Shadows */}

      {(direction === "horizontal" || direction === "both") && shadows.left && (
        <div
          onClick={() => scroll("horizontal", -SCROLL_AMOUNT)}
          className="absolute top-0 bottom-0 left-0 z-10 flex w-6 cursor-pointer items-center justify-center"
          style={{
            background: `linear-gradient(to right, ${currentShadowColor}, transparent)`,
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, "horizontal", -SCROLL_AMOUNT)}
        >
          {icon && (
            <ChevronLeft
              size={16}
              strokeWidth={2.5}
              className="rounded-full bg-white p-[1.5px] dark:bg-background"
            />
          )}
        </div>
      )}

      {(direction === "horizontal" || direction === "both") &&
        shadows.right && (
          <div
            onClick={() => scroll("horizontal", SCROLL_AMOUNT)}
            className="absolute top-0 right-0 bottom-0 z-10 flex w-6 cursor-pointer items-center justify-center"
            style={{
              background: `linear-gradient(to left, ${currentShadowColor}, transparent)`,
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, "horizontal", SCROLL_AMOUNT)}
          >
            {icon && (
              <ChevronRight
                size={16}
                strokeWidth={2.5}
                className="rounded-full bg-white p-[1.5px] dark:bg-background"
              />
            )}
          </div>
        )}

      {/* Scrollable Content */}

      <div
        ref={scrollRef}
        id={id}
        className={cn(
          className,
          direction === "vertical"
            ? "h-full overflow-y-auto"
            : direction === "horizontal"
              ? "w-full overflow-x-auto"
              : "h-full w-full overflow-auto",
          "no-scrollbar"
        )}
      >
        {children}
      </div>
    </div>
  )
}
