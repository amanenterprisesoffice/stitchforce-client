import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  label: string
  value: string
}

export function CopyButton({ label, value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {label}

      <Button
        variant="link"
        size="icon"
        className="h-3.5 w-3.5 ml-1"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy"}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </>
  )
}
