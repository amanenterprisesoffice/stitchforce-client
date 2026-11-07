import { QuickLinks, QuickLinkItem } from "@/components/ui/quick-links"
import { Package, PackageCheck, UserRound } from "lucide-react"

type QuickLinksProps = {
  bundle?: { id: string }
  style?: { id: string }
  worker?: { id: string }
  entry: { worker_id: string }
  router: any
}
const ProdEntryQuickLinks = ({
  bundle,
  style,
  worker,
  entry,
  router,
}: QuickLinksProps) => {
  return (
    <>
      <QuickLinks className="h-fit!">
   
        <QuickLinkItem
          icon={<PackageCheck className="size-5" />}
          title="View worker's production entries"
          description="See all production records for this worker."
          onClick={() =>
            router.push(
              `/production-entries?worker_id=${encodeURIComponent(entry.worker_id)}`
            )
          }
        />

        <QuickLinkItem
          icon={<Package className="size-5" />}
          title="All production entries"
          description="Browse all production records."
          onClick={() => router.push("/production-entries")}
        />
      </QuickLinks>
    </>
  )
}

export default ProdEntryQuickLinks
