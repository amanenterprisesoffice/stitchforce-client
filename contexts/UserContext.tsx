"use client"

import Loader from "@/components/ui/Loader"
import { isPublicRoute, isPublicOnlyRoute } from "@/constants/routes"
import useFetch from "@/hooks/useFetch"
import { logout } from "@/utils/utils"
import { User } from "@/utils/types/user"
import { usePathname, useRouter } from "next/navigation"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { toast } from "sonner"


// Define the context value type
interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  refetch: () => void
  isLoading: boolean
}

// Create the UserContext with a default value
const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Check if the route is public or public-only
  const pathname = usePathname()
  const isPublic = isPublicRoute(pathname)
  const isPublicOnly = isPublicOnlyRoute(pathname)

  const isPrivateRoute = Boolean(pathname && !isPublic && !isPublicOnly)
  // Use custom fetch hook
  const { refetch } = useFetch({
    auto: true,
    url: `/api/users/me`,
    onSuccess: (result) => {
      const user: User = result.user
      setUser(user)
      setIsLoading(false)
    },
    showErrorToast: isPrivateRoute,
    onError: async (err: any) => {
      const res = await logout()
      if (isPrivateRoute) {
        router.push("/login")
      }
      setIsLoading(false)
    },
  })

  // If loading, display loader
  if (isLoading) return <Loader fullScreen />

  return (
    <UserContext.Provider value={{ user, setUser, refetch, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
