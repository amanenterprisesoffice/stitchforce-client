// Quick links

import { Package, ClipboardList, Download, ListClockIcon } from "lucide-react"
import Link from "next/link"
import { QuickLinks, QuickLinkItem } from "@/components/ui/quick-links"
import { useRouter } from "next/navigation"

interface StyleQuickLinksProps {
  styleID: string
}

export function StyleQuickLinks({ styleID }: StyleQuickLinksProps) {
  const router = useRouter()
  const links = [
    {
      title: "View all bundles",
      description: "See every bundle created for this style",
      onClick: () =>
        router.push(`/bundles?style_id=${encodeURIComponent(styleID)}`),
      icon: Package,
    },
    {
      title: "View production entries",
      description: "See production records for this style",
      onClick: () =>
        router.push(
          `/production-entries?style_id=${encodeURIComponent(styleID)}`
        ),
      icon: ClipboardList,
    },
    {
      title: "View pending production entries",
      description: "See all pending production records for this bundle",
      icon: ListClockIcon,
      onClick: () =>
        router.push(
          `/production-entries?style_id=${encodeURIComponent(styleID)}&status=payable`
        ),
    },
    // download style
    // {
    //   title: "Download style",
    //   description: "Export all records related to this style",
    //   onClick: () =>
    //     router.push(`/styles/${encodeURIComponent(styleID)}/download`),
    //   icon: Download,
    // },
  ]

  return (
    <QuickLinks
      title="Quick links"
      description="Quickly navigate to related style records"
    >
      {links.map((link) => {
        const Icon = link.icon

        return (
          <QuickLinkItem
            icon={<Icon className="size-5" />}
            title={link.title}
            description={link.description}
            onClick={() => {
              link.onClick()
            }}
            key={link.title}
          />
        )
      })}
    </QuickLinks>
  )
}
