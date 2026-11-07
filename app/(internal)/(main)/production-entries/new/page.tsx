"use client"
import AddNewProdEntryHeader from "./components/header"
import NewProductionEntryForm from "./components/production-entry-form"

export default function NewProductionEntriesPage() {
  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-5 p-4 md:p-6">
      <AddNewProdEntryHeader />

      <div className="mx-auto h-fit w-full">
        <NewProductionEntryForm />
      </div>
    </main>
  )
}
