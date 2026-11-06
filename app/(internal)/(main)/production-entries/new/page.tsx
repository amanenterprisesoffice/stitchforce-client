"use client"
import AddNewProdEntryHeader from "./components/header"
import NewProductionEntryForm from "./components/production-entry-form"

export default function NewProductionEntriesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <AddNewProdEntryHeader />

      <div className="mx-auto w-full h-full">
        <NewProductionEntryForm />
      </div>
    </div>
  )
}
