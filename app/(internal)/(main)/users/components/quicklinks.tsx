"use client"

import { useRouter } from "next/navigation"

import { ClipboardList, CreditCard, Download } from "lucide-react"

import { QuickLinks, QuickLinkItem } from "@/components/ui/quick-links"

import { User } from "@/utils/types/user"
const UserQuickLinks = ({ user }: { user: User }) => {
  const router = useRouter()


  const handleViewEntries = ({
    queryParams,
  }: {
    queryParams?: Record<string, string>
  }) => {
    const queryString = new URLSearchParams({
      user_id: user.id,
      ...queryParams,
    }).toString()
    router.push(`/production-entries?${queryString}`)
  }

  const handleViewPayments = () => {
    router.push(`/user-payments?user_id=${user.id}`)
  }

  return (
    <>
      <QuickLinks className="h-fit!">
        <QuickLinkItem
          icon={<ClipboardList className="size-5" />}
          title="View production entries"
          description="See all production records for this worker."
          onClick={() => handleViewEntries({ queryParams: { status: "all" } })}
        />

        <QuickLinkItem
          icon={<ClipboardList className="size-5" />}
          title="View pending payment entries"
          description="See all production records for this worker."
          onClick={() =>
            handleViewEntries({ queryParams: { status: "pending" } })
          }
        />

        <QuickLinkItem
          icon={<CreditCard className="size-5" />}
          title="View payments"
          description="See the worker's complete payment history."
          onClick={handleViewPayments}
        />
      </QuickLinks>
    </>
  )
}

export default UserQuickLinks
