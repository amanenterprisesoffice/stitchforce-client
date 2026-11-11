"use client"

import { useEffect, useState } from "react"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FormSelect from "@/components/ui/FormSelect"
import Loader from "@/components/ui/Loader"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface InviteUserValues {
  email: string
  role: "org_admin" | "staff"
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: InviteUserValues) => Promise<void>
  isSaving: boolean
}

export default function InviteUserDialog({
  open,
  onOpenChange,
  onSubmit,
  isSaving,
}: Props) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"org_admin" | "staff">("staff")

  useEffect(() => {
    if (open) {
      setEmail("")
      setRole("staff")
    }
  }, [open])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) return

    await onSubmit({
      email: trimmedEmail,
      role,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite user</DialogTitle>
            <DialogDescription>
              Send an invitation to add someone to your organization.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-5">
            <div className="grid gap-2">
              <label htmlFor="invite_email" className="text-sm font-medium">
                Email address
              </label>

              <Input
                id="invite_email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                maxLength={255}
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-2">
              <FormSelect
                id="invite_role"
                label="Role"
                value={role}
                onChange={(value: string) =>
                  setRole(value as InviteUserValues["role"])
                }
                options={[
                  { value: "staff", label: "Staff" },
                  {
                    value: "admin",
                    label: "Admin",
                  },
                ]}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving || !email.trim()}>
              {isSaving ? "Sending..." : "Send invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
