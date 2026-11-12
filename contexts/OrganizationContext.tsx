"use client"

import useFetch from "@/hooks/useFetch"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { useUser } from "./UserContext"
import type { Organization } from "@/utils/types/organization"

interface OrganizationContextType {
  organization: Organization | null
  setOrganization: React.Dispatch<React.SetStateAction<Organization | null>>

  refetch: () => Promise<void>
  update: (formData: FormData) => Promise<void>
  remove: () => Promise<void>

  isLoading: boolean
  isUpdating: boolean
  isDeleting: boolean
}

const OrganizationContext = createContext<
  OrganizationContextType | undefined
>(undefined)

interface OrganizationProviderProps {
  children: ReactNode
}

export const OrganizationProvider = ({
  children,
}: OrganizationProviderProps) => {
  const { user } = useUser()

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { refetch: fetchOrganization } = useFetch<Organization>({
    auto: false,
    showErrorToast: true,
    onSuccess: (result) => {
      setOrganization(result)
      setIsLoading(false)
    },
    onError: () => {
      setOrganization(null)
      setIsLoading(false)
    },
  })

  const refetch = async () => {
    if (!user?.organization_id) {
      setOrganization(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    await fetchOrganization({
      url: `/api/organizations/${user.organization_id}`,
      method: "GET",
    })
  }

  const { refetch: updateOrganization, isLoading: isUpdating } =
    useFetch<Organization>({
      auto: false,
      showErrorToast: true,
      onSuccess: () => {
        refetch()
      },
    })

  const { refetch: deleteOrganization, isLoading: isDeleting } = useFetch({
    auto: false,
    showErrorToast: true,
    onSuccess: () => {
      setOrganization(null)
    },
  })

  const update = async (formData: FormData) => {
    if (!user?.organization_id) return

    await updateOrganization({
      url: `/api/organizations/${user.organization_id}`,
      method: "PUT",
      payload: formData,
    })
  }

  const remove = async () => {
    if (!user?.organization_id) return

    await deleteOrganization({
      url: `/api/organizations/${user.organization_id}`,
      method: "DELETE",
    })
  }

  useEffect(() => {
    if (!user?.organization_id) {
      setOrganization(null)
      setIsLoading(false)
      return
    }

    refetch()
  }, [user?.organization_id])

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        setOrganization,
        refetch,
        update,
        remove,
        isLoading,
        isUpdating,
        isDeleting,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext)

  if (!context) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    )
  }

  return context
}