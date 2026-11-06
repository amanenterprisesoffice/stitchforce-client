"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Download, ExternalLink, QrCode } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface QRCodeProps {
  value: string
  title?: string
  description?: string
  fileName?: string
  size?: number
  downloadLabel?: string
  openLabel?: string
  showOpenLink?: boolean
}

export default function QRCode({
  value,
  title = "QR code",
  description = "Scan this QR code to open the link.",
  fileName = "qr-code",
  size = 220,
  downloadLabel = "Download",
  openLabel = "Open link",
  showOpenLink = true,
}: QRCodeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const qrValue = useMemo(() => {
    if (!value) return ""

    // Resolve relative paths against the current application origin.
    if (value.startsWith("/") && origin) {
      return `${origin}${value}`
    }

    return value
  }, [value, origin])

  const handleDownload = () => {
    const canvas = wrapperRef.current?.querySelector("canvas")
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `${fileName}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const handleOpen = () => {
    if (!qrValue) return

    window.open(qrValue, "_blank", "noopener,noreferrer")
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <QrCode className="size-4 text-muted-foreground" />
          {title}
        </CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center pt-0">
        <div
          ref={wrapperRef}
          className="flex w-full items-center justify-center rounded-lg border bg-white p-4"
        >
          {qrValue ? (
            <QRCodeCanvas
              value={qrValue}
              size={size}
              level="H"
              includeMargin
              bgColor="#ffffff"
              fgColor="#111111"
            />
          ) : (
            <div
              className="flex items-center justify-center text-sm text-muted-foreground"
              style={{ width: size, height: size }}
            >
              {value ? "Preparing QR code…" : "No QR data available"}
            </div>
          )}
        </div>

        <div
          className={`mt-4 grid w-full gap-2 ${
            showOpenLink ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!qrValue}
          >
            <Download className="mr-2 size-4" />
            {downloadLabel}
          </Button>

          {showOpenLink && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpen}
              disabled={!qrValue}
            >
              <ExternalLink className="mr-2 size-4" />
              {openLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}