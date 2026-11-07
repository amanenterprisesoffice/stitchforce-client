"use client"

import AddNewWorkerPaymentHeader from "./components/header"
import NewWorkerPaymentForm from "./components/payment-form"

export default function NewWorkerPaymentPage() {
  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-5 p-4 md:p-6">
      <AddNewWorkerPaymentHeader />
      <div className="mx-auto h-full w-full">
        <NewWorkerPaymentForm />
      </div>
    </main>
  )
}
