'use client'

import {
  AreaChart,
  BookCopy,
  BrainCircuit,
  LayoutDashboard,
  LineChart,
  PanelLeft,
  Settings,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function SidebarNav() {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()

  const navItems = [
    {
      href: '/',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      href: '/markets',
      icon: LineChart,
      label: 'Markets',
    },
    {
      href: '/pro-feed',
      icon: AreaChart,
      label: 'Pro Feed',
    },
    {
      href: '/ledger',
      icon: BookCopy,
      label: 'Performance Ledger',
    },
    {
      href: '/tools',
      icon: BrainCircuit,
      label: 'AI Tools',
    },
    {
      href: '/admin',
      icon: Shield,
      label: 'Admin Console',
    },
  ]

  return (
    <>
      <SidebarHeader>
        <div className="flex w-full items-center justify-between p-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex aspect-square w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-headline text-lg font-bold">P</span>
            </div>
            <span className="inline-block whitespace-nowrap font-headline text-base font-medium">
              Predictive Insights
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="group hidden h-7 w-7 items-center justify-center rounded-md outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:flex"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-4 w-4 transition-transform duration-300 ease-in-out group-data-[state=expanded]:rotate-180" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                  }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings">
              <SidebarMenuButton
                isActive={pathname === '/settings'}
                tooltip={{
                  children: 'Settings',
                }}
              >
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
