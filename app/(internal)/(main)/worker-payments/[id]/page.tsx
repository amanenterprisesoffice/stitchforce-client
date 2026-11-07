"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Ban, CreditCard, Wallet } from "lucide-react"
import { toast } from "sonner"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"
import Loader from "@/components/ui/Loader"
import StateComponent from "@/components/StateComponent"
import { Button } from "@/components/ui/button"

import PaymentDetailsHeader from "./components/header"
import PaymentSummary from "./components/payment-summary"
import TransactionCard from "./components/transaction-card"
import ProductionEntriesTable from "./components/production-entries-table"

export interface PaymentWorker {
  id: string
  name: string
  phone?: string
  gender?: string
  photo_url?: string
}

export interface PaymentProductionEntry {
  id: string
  organization_id?: string
  bundle_id: string
  worker_id: string
  style_operation_id: string
  quantity: number
  rate_per_piece: number
  total_amount: number
  allocated_amount?: number
  production_date: string
  remarks?: string
  worker?: { id?: string; name?: string; phone?: string }
  bundle?: {
    id: string
    bundle_number: string
    quantity: number
    status: string
  }
  style?: { id: string; name: string; style_number?: string }
  operation?: { id: string; name: string; rate_per_piece: number }
  created_at?: string
  updated_at?: string
}

export interface WorkerPayment {
  id: string
  organization_id: string
  worker_id: string
  amount: number
  payment_date: string
  payment_method: string
  reference?: string
  remarks?: string
  status: "completed" | "voided" | string
  created_at: string
  updated_at?: string
  production_entry: PaymentProductionEntry[]
  worker?: PaymentWorker
}

export default function WorkerPaymentDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const paymentID = params.id
  const { user } = useUser()
  const organizationID = user?.organization_id
  const [voidDialogOpen, setVoidDialogOpen] = useState(false)

  const paymentURL =
    organizationID && paymentID
      ? `/api/organizations/${organizationID}/worker-payments/${paymentID}`
      : ""

  const {
    data,
    isLoading,
    refetch: fetchPayment,
  } = useFetch<WorkerPayment>({
    auto: !!paymentURL,
    url: paymentURL,
    method: "GET",
  })

  const { refetch: voidPayment, isLoading: isVoiding } = useFetch({
    auto: false,
  })

  const payment = data ?? null

  const handleVoid = async () => {
    if (!paymentURL || !payment) return

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

  if (isLoading && !payment) return <Loader text="Loading payment" />

  if (!organizationID || !payment) {
    return (
      <StateComponent
        message="Payment not found"
        description="The requested worker payment could not be found or is not accessible."
        PortalButton={
          <Button
            variant="outline"
            onClick={() => router.push("/worker-payments")}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to payments
          </Button>
        }
      />
    )
  }

  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col gap-5 p-4 md:p-6">
      <PaymentDetailsHeader
        payment={payment}
        onVoid={() => setVoidDialogOpen(true)}
      />

      <PaymentSummary payment={payment} />
      <TransactionCard payment={payment} />

      <ProductionEntriesTable entries={payment.production_entry ?? []} />

    </main>
  )
}
