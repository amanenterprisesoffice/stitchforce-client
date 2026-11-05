"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Download, ExternalLink, QrCode } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BundleQRCodeProps {
  bundleId: string
  bundleNumber?: string
}

export default function BundleQRCode({
  bundleId,
  bundleNumber,
}: BundleQRCodeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const productionEntryURL = useMemo(() => {
    if (!origin || !bundleId) return ""
    return `${origin}/production-entries/new?bundle_id=${encodeURIComponent(bundleId)}`
  }, [origin, bundleId])

  const handleDownload = () => {
    const canvas = wrapperRef.current?.querySelector("canvas")
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `${bundleNumber || "bundle"}-production-qr.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <QrCode className="size-4 text-muted-foreground" />
          Production QR code
        </CardTitle>
        <CardDescription>
          Scan to open a new production entry with this bundle selected.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center pt-0">
        <div
          ref={wrapperRef}
          className="flex w-full items-center justify-center rounded-lg border bg-white p-4"
        >
          {productionEntryURL ? (
            <QRCodeCanvas
              value={productionEntryURL}
              size={220}
              level="H"
              includeMargin
              bgColor="#ffffff"
              fgColor="#111111"
            />
          ) : (
            <div className="flex size-[220px] items-center justify-center text-sm text-muted-foreground">
              Preparing QR code…
            </div>
          )}
        </div>

        {/* <p className="mt-3 w-full break-all text-center font-mono text-[11px] text-muted-foreground">
          {productionEntryURL || "Preparing link…"}
        </p> */}

        <div className="mt-4 grid w-full grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!productionEntryURL}
          >
            <Download className="mr-2 size-4" />
            Download
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!productionEntryURL}
            onClick={() => window.open(productionEntryURL, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="mr-2 size-4" />
            Open link
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
