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
        className="ml-1 size-3"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy"}
      >
        {copied ? (
          <Check className="size-3.5 text-primary" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </Button>
    </>
  )
}
