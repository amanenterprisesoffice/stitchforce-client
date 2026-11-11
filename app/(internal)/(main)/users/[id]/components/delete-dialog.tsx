"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Loader from "@/components/ui/Loader"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  onConfirm: () => Promise<void>
  isDeleting: boolean
}

export default function DeleteUserDialog({
  open,
  onOpenChange,
  userName,
  onConfirm,
  isDeleting,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete {userName}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              void onConfirm()
            }}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting && <Loader spinnerClassName="h-4 w-4" variant="destructive" />}
            Delete user
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
