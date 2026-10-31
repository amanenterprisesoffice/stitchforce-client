'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logout as handleLogout } from '@/lib/utils'
import { Box, SignpostBigIcon, UserIcon, UserSquare2 } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import AutoBreadcrumbs from './AutoBreadCrumps'
import { Button } from './button'
import { ModeToggle } from '../theme-toggle'
import { useTheme } from 'next-themes'

const Header = ({ className, ...props }: { className?: String }) => {
    const router = useRouter()
    const { theme } = useTheme()
    const { user, isLoading } = useUser()
    const pathname = usePathname();
    const isHome = pathname === '/'

    const handleLogin = () => {
        router.push('/login')
    }

    const handleRegister = () => {
        router.push('/register')
    }

    return (
        <header className={`${theme == "dark" ? "navbar-dark" : "navbar-light"} w-full flex justify-between items-center z-40 py-4 border-b ${className}`} {...props}>
            <div className="my-container mx-auto flex justify-between items-center w-full">
                {/* Logo */}
                <h1 className="text-[13px] font-semibold">
                    <Link href="/" className="hover:text-primary flex gap-1 items-center">
                        <Box size={20} className="text-secondary-foreground -mt-0.5" />
                        Singleton
                    </Link>
                </h1>

                {/* Desktop + Mobile Nav */}
                <div className="flex items-center lg:gap-5">
                    <nav className="hidden lg:flex space-x-5 text-xs items-center">
                        {!isLoading && user ? (
                            !isHome && <AutoBreadcrumbs />
                        ) : (
                            <>
                                <Link href="/" className="hover:text-gray-200">Home</Link>
                                <Link href="/dashboard" className="hover:text-gray-200">Dashboard</Link>
                                <Link href="/projects" className="hover:text-gray-200">Projects</Link>
                                <Link href="/blog" className="hover:text-gray-200">Blog</Link>
                            </>
                        )}
                    </nav>

                    {!isHome && <span className="ml-2 hidden lg:block">|</span>}

                    {/* User Menu */}
                    <div className="flex gap-3 items-center">
                        {!isLoading && user ? (
                            <>
                                <UserDropdown user={user} />
                                <Link href="/dashboard">
                                    <Button size='sm' className="hidden lg:block">{user ? 'Go to dashbaord' : 'Try Visual Editor'}</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={handleLogin}>Login</Button>
                                <Button onClick={handleRegister}>Register</Button>
                            </>
                        )}
                    </div>
                    <ModeToggle />

                </div>
            </div>
        </header>
    )
}

export default Header



const UserDropdown = ({ user }: any) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className=''>
                {user.imageUrl ? (
                    <img
                        src={user.imageUrl}
                        alt={user.name}
                        width={35}
                        height={35}
                        className="border-green-700 hover:border-primary p-0.5 rounded-full object-cover aspect-square"
                    />
                ) : (
                    <div className="w-7 aspect-square border-green-700 hover:border-primary p-0.5 rounded-full flex items-center justify-center bg-muted">
                        <UserIcon className="w-full h-full p-1 text-muted-foreground" />
                    </div>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 p-2 bg-background text-text shadow-xl border border-muted">
                {/* User Info */}
                <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-text truncate">{user.email}</p>
                </div>

                <DropdownMenuSeparator className="bg-muted" />

                {/* Navigation Links */}
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full hover:text-primary">
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/projects" className="w-full hover:text-primary">
                        Projects
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/blog" className="w-full hover:text-primary">
                        Blog
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-muted" />

                {/* Logout */}
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 focus:bg-red-500/10"
                >
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}