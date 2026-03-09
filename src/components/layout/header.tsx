'use client'

import { LogOut, Search, Settings } from 'lucide-react'
import Link from 'next/link'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarTrigger } from '../ui/sidebar'
import { useAuth, useUser } from '@/firebase'
import { signOut } from 'firebase/auth'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useUserProfile } from '@/firebase/auth/use-user-profile'

export default function Header() {
  const { user, isUserLoading } = useUser()
  const { data: profile } = useUserProfile()
  const auth = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({
        title: 'Signed Out',
        description: "You've successfully signed out.",
      })
      router.push('/')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Out Error',
        description: error.message,
      })
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm lg:px-6">
      <div className="flex-1">
        <SidebarTrigger className="md:hidden" />
      </div>
      <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contracts..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        {isUserLoading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.photoURL || user.photoURL || undefined} />
                  <AvatarFallback>
                    {(profile?.displayName || user.email)?.[0].toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
