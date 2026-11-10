"use client"

// import Header from "@/components/ui/Header"
import { usePathname } from "next/navigation" // Hook to get the current path
import { useEffect } from "react"
import "@/app/globals.css"
import { UserProvider } from "@/contexts/UserContext"
import { OrganizationProvider } from "@/contexts/OrganizationContext"

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <UserProvider>
        <OrganizationProvider>{children}</OrganizationProvider>
      </UserProvider>
    </>
  )
}

export default MainLayout
