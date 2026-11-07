"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout as handleLogout } from "@/utils/utils"
import { Scissors, UserIcon } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { Button } from "./button"
import { ModeToggle } from "../theme-toggle"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/#product-preview" },
]

const privateLinks = [
  { label: "Workers", href: "/workers" },
  { label: "Styles", href: "/styles" },
  { label: "Bundles", href: "/bundles" },
]

const Header = ({ className = "" }: { className?: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useUser()

  const isHome = pathname === "/"

  return (
 <header
  className={`navbar-light navbar-dark relative z-50 w-full shrink-0 border-b ${className}`}
>
      <div className="my-container mx-auto flex h-[68px] w-full items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Scissors size={19} />
          </div>

          <span className="text-base font-bold tracking-tight">
            StitchForce
          </span>
        </Link>

        {/* Navigation + Right Actions */}
        <div className="flex items-center gap-3 lg:gap-5">
          {/* Navigation */}
          <nav className="hidden items-center gap-5 text-xs lg:flex">
            {!isLoading && user
              ? privateLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`)

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`font-medium transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      } `}
                    >
                      {link.label}
                    </Link>
                  )
                })
              : publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-medium transition-colors ${
                      isHome && link.href === "/"
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    } `}
                  >
                    {link.label}
                  </Link>
                ))}
          </nav>

          {/* Original separator */}
          {!isLoading && (
            <span className="hidden text-muted-foreground lg:block">|</span>
          )}

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {!isLoading && user ? (
              <>
                <UserDropdown user={user} />

                <Button
                  size="sm"
                  render={<Link href="/dashboard">Dashboard</Link>}
                  className="hidden lg:inline-flex"
                ></Button>
              </>
            ) : (
              !isLoading && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </Button>

                  <Button size="sm" onClick={() => router.push("/register")}>
                    Register
                  </Button>
                </>
              )
            )}
          </div>

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header

// User dropdown
const UserDropdown = ({ user }: { user: any }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border bg-muted transition-colors outline-none hover:border-primary"
            aria-label="Open user menu"
          >
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.name || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        }
      />

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/dashboard">Dashboard</Link>} />

        <DropdownMenuItem render={<Link href="/workers">Workers</Link>} />

        <DropdownMenuItem render={<Link href="/styles">Styles</Link>} />

        <DropdownMenuItem render={<Link href="/production">Production</Link>} />

        <DropdownMenuItem render={<Link href="/payments">Payments</Link>} />

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
