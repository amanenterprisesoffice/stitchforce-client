"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Users } from "lucide-react"

import useFetch from "@/hooks/useFetch"
import { useUser } from "@/contexts/UserContext"

import Loader from "@/components/ui/Loader"
import { Button } from "@/components/ui/button"
import State from "@/components/StateComponent"
import StateComponent from "@/components/StateComponent"
import Pagination from "@/components/ui/pagination"

import UserFilters from "./components/filters"
import InviteUserDialog, {
  type InviteUserValues,
} from "./components/invite-dialog"

import type { User } from "@/utils/types/user"
import UsersList from "./components/table"
import UsersHeader from "./components/header"

const DEFAULT_LIMIT = 25

export default function UsersPage() {
  const { user } = useUser()
  const organizationID = user?.organization_id

  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(0)

  const [inviteOpen, setInviteOpen] = useState(false)

  const usersURL = organizationID
    ? `/api/organizations/${organizationID}/users`
    : ""

  const requestURL = useMemo(() => {
    const params = new URLSearchParams()

    if (search.trim()) {
      params.set("search", search.trim())
    }

    if (role) {
      params.set("role", role)
    }

    params.set("limit", String(limit))
    params.set("offset", String(offset))

    return `${usersURL}?${params.toString()}`
  }, [usersURL, search, role, limit, offset])

  const {
    data: usersData,
    isLoading,
    refetch: fetchUsers,
  } = useFetch<User[]>({
    auto: false,
  })

  const {
    isLoading: isInviting,
    refetch: inviteUser,
  } = useFetch()

  const users: User[] = Array.isArray(usersData) ? usersData : []

  const hasNextPage = users.length === limit

  const loadUsers = useCallback(() => {
    if (!organizationID) return

    fetchUsers({
      url: requestURL,
    })
  }, [organizationID, requestURL, fetchUsers])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setOffset(0)
  }, [])

  const handleRoleChange = useCallback((value: string) => {
    setRole(value)
    setOffset(0)
  }, [])

  const handleInvite = async (values: InviteUserValues) => {
    if (!organizationID) {
      toast.error("Organization not found")
      return
    }

    await inviteUser({
      url: `/api/organizations/${organizationID}/invitations`,
      method: "POST",
      payload: {
        email: values.email.trim(),
        role: values.role,
      },
      onSuccess: () => {
        toast.success("Invitation sent successfully")
        setInviteOpen(false)
      },
    })
  }

  if (!organizationID) {
    return (
      <StateComponent
        className="rounded-none"
        message="Error"
        description="Organization not found."
      />
    )
  }

  const isEmptyPage = users.length === 0 && offset > 0
  const hasActiveFilters = !!search.trim() || !!role

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <UsersHeader
        count={users.length}
        onInvite={() => setInviteOpen(true)}
      />

      <UserFilters
        search={search}
        role={role}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
      />

      <div className="relative flex flex-1 flex-col">
        {isLoading && !usersData ? (
          <Loader text="Loading users" />
        ) : isEmptyPage ? (
          <State
            message="No more users on this page"
            description="There are no users available on this page."
            ICON={<Users />}
            PortalButton={
              <Button
                variant="outline"
                onClick={() => setOffset(0)}
              >
                Go to first page
              </Button>
            }
          />
        ) : users.length === 0 ? (
          <State
            message={
              hasActiveFilters ? "No users found" : "No users yet"
            }
            description={
              hasActiveFilters
                ? "Try changing your search or role filter."
                : "Invite your team members to give them access to this organization."
            }
            ICON={<Users />}
            PortalButton={
              hasActiveFilters ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("")
                    setRole("")
                    setOffset(0)
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setInviteOpen(true)}
                >
                  Invite your first user
                </Button>
              )
            }
          />
        ) : (
          <UsersList users={users} />
        )}
      </div>

      {(users.length > 0 || offset > 0) && (
        <Pagination
          limit={limit}
          offset={offset}
          itemCount={users.length}
          hasNextPage={hasNextPage}
          onPageChange={setOffset}
          onLimitChange={(nextLimit) => {
            setLimit(nextLimit)
            setOffset(0)
          }}
        />
      )}

      <InviteUserDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSubmit={handleInvite}
        isSaving={isInviting}
      />
    </div>
  )
}