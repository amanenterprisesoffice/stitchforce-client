"use client"

import Loader from "@/components/ui/Loader"
import useFetch from "@/hooks/useFetch"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { useUser } from "./UserContext"

export interface Organization {
  id: string
  name: string
  license_status: "active" | "suspended" | "expired"
  license_expires_at: string | null
  created_at: string
  updated_at: string
}

interface OrganizationContextType {
  organization: Organization | null
  setOrganization: React.Dispatch<React.SetStateAction<Organization | null>>
  refetch: () => Promise<void>
  isLoading: boolean
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
)

interface OrganizationProviderProps {
  children: ReactNode
}

export const OrganizationProvider = ({
  children,
}: OrganizationProviderProps) => {
  const { user } = useUser()

  const [organization, setOrganization] = useState<Organization | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  const { refetch } = useFetch({
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

  useEffect(() => {
    if (!user?.organization_id) {
      setOrganization(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    refetch({
      url: `/api/organizations/${user.organization_id}`,
      method: "GET",
    })
  }, [user?.organization_id, refetch])

  if (isLoading) return <Loader fullScreen />

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        setOrganization,
        refetch,
        isLoading,
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
