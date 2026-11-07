"use client"

import AddNewWorkerPaymentHeader from "./components/header"
import NewWorkerPaymentForm from "./components/payment-form"

export default function NewWorkerPaymentPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <AddNewWorkerPaymentHeader />
      <div className="mx-auto h-full w-full">
        <NewWorkerPaymentForm />
      </div>
    </div>
  )
}
