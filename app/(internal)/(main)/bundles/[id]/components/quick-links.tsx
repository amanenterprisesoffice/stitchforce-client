"use client"

import { useRouter } from "next/navigation"
import { ClipboardList, ListClockIcon, Plus } from "lucide-react"

import {
  QuickLinks,
  QuickLinkItem,
} from "@/components/ui/quick-links"

import type { Bundle } from "@/utils/types/bundle"

interface BundleQuickLinksProps {
  bundle: Bundle
}

export default function BundleQuickLinks({
  bundle,
}: BundleQuickLinksProps) {
  const router = useRouter()

  const links = [
    {
      title: "View production entries",
      description: "See all production records for this bundle",
      icon: ClipboardList,
      onClick: () =>
        router.push(
          `/production-entries?bundle_id=${encodeURIComponent(bundle.id)}`
        ),
    },
    {
      title: "View pending production entries",
      description: "See all pending production records for this bundle",
      icon: ListClockIcon,
      onClick: () =>
        router.push(
          `/production-entries?style_id=${encodeURIComponent(bundle.style_id)}&bundle_id=${encodeURIComponent(bundle.id)}&status=payable`
        ),
    },
    {
      title: "Add production entry",
      description: "Record completed work for this bundle",
      icon: Plus,
      onClick: () =>
        router.push(
          `/production-entries/new?style_id=${encodeURIComponent(bundle.style_id)}&bundle_id=${encodeURIComponent(bundle.id)}`
        ),
    },
  ]

  return (
    <QuickLinks
      title="Quick links"
      description="Common actions for this bundle"
    >
      {links.map((link) => {
        const Icon = link.icon

        return (
          <QuickLinkItem
            key={link.title}
            icon={<Icon className="size-5" />}
            title={link.title}
            description={link.description}
            onClick={link.onClick}
          />
        )
      })}
    </QuickLinks>
  )
}