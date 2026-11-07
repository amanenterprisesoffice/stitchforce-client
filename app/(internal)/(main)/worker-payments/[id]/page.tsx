"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Ban, CreditCard, UserRound, Wallet } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"
import Loader from "@/components/ui/Loader"
import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import VoidPaymentDialog from "../components/void-dialog"
import type { WorkerPayment } from "@/utils/zodSchema/payments"
import { GarmentWorker } from "@/utils/zodSchema/garmentWorker"
import { formatDate, formatMoney } from "@/utils/utils"

export default function WorkerPaymentDetailsPage() {
  const params = useParams()
  const paymentID = params.id as string
  const { user } = useUser()
  const organizationID = user?.organization_id
  const [voidDialogOpen, setVoidDialogOpen] = useState(false)

  const paymentURL =
    organizationID && paymentID
      ? `/api/organizations/${organizationID}/worker-payments/${paymentID}`
      : ""

  const {
    data: paymentData,
    isLoading,
    refetch: fetchPayment,
  } = useFetch({
    auto: !!paymentURL,
    url: paymentURL,
    method: "GET",
  })

  const payment: WorkerPayment | null = paymentData ?? null
  const workerURL =
    organizationID && payment?.worker_id
      ? `/api/organizations/${organizationID}/garment-workers/${payment.worker_id}`
      : ""

  const { data: workerData } = useFetch({
    auto: !!workerURL,
    url: workerURL,
    method: "GET",
  })
  const worker: GarmentWorker | null = workerData ?? payment?.worker ?? null

  const { refetch: voidPayment, isLoading: isVoiding } = useFetch({
    auto: false,
  })

  const handleVoid = async () => {
    if (!payment) return
    await voidPayment({
      url: `${paymentURL}/void`,
      method: "PATCH",
      onSuccess: () => {
        toast.success("Payment voided successfully")
        setVoidDialogOpen(false)
        fetchPayment({ url: paymentURL, method: "GET" })
      },
      onError: (error: any) =>
        toast.error(error?.message || "Failed to void payment"),
    })
  }

  if (isLoading && !payment) return <Loader />

  if (!organizationID || !payment) {
    return (
      <StateComponent
        message="Payment not found"
        description="The requested worker payment could not be found."
        PortalButton={
          <Button
            variant="outline"
            render={
              <Link href="/worker-payments">
                <ArrowLeft className="mr-2 size-4" />
                Back to payments
              </Link>
            }
          ></Button>
        }
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            render={
              <Link href="/worker-payments">
                <ArrowLeft className="mr-2 size-4" />
                Back to payments
              </Link>
            }
            className="-ml-3"
          ></Button>
          {/* Removed because render prop now handles the link */}
          <h1 className="text-2xl font-semibold tracking-tight">
            Payment details
          </h1>
          <p className="text-sm text-muted-foreground">
            Payment record and transaction information.
          </p>
        </div>
        {payment.status === "completed" && (
          <Button variant="destructive" onClick={() => setVoidDialogOpen(true)}>
            <Ban className="mr-2 size-4" />
            Void payment
          </Button>
        )}
      </div>

      <Card className="shadow-none">
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Payment amount</p>
            <p className="text-3xl font-semibold tabular-nums">
              {formatMoney(payment.amount)}
            </p>
          </div>
          <Badge
            variant={payment.status === "completed" ? "default" : "secondary"}
          >
            {payment.status}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserRound className="size-4 text-muted-foreground" />
              Worker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/garment-workers/${payment.worker_id}`}
              className="flex items-center gap-3 hover:text-primary"
            >
              {worker?.photo_url ? (
                <img
                  src={worker.photo_url}
                  alt=""
                  className="size-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                  <UserRound className="size-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-medium">{worker?.name || "View worker"}</p>
                <p className="text-sm text-muted-foreground">
                  {worker?.phone || payment.worker_id}
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4 text-muted-foreground" />
              Transaction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Payment method</span>
              <span className="font-medium capitalize">
                {payment.payment_method}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-medium">{payment.reference || "—"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Payment date</span>
              <span className="font-medium">
                {formatDate(payment.payment_date)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="size-4 text-muted-foreground" />
              Additional information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Payment ID</span>
              <span className="font-mono text-xs break-all">{payment.id}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Created</span>
              <span>{formatDate(payment.created_at)}</span>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Remarks</p>
              <p>{payment.remarks || "No remarks"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <VoidPaymentDialog
        open={voidDialogOpen}
        onOpenChange={setVoidDialogOpen}
        payment={payment}
        onConfirm={handleVoid}
        isVoiding={isVoiding}
      />
    </div>
  )
}
